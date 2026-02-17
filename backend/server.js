const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Import HTTP
const { Server } = require("socket.io"); // Import Socket.io

// Load environment variables
dotenv.config();

// Set mongoose options
mongoose.set('strictQuery', false);

const { resolveTenant } = require('./middleware/tenantMiddleware');

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://map-recruit-ai-type-script.vercel.app",
            "https://maprecruit.ai",
            "https://*.maprecruit.com",
            "https://www.maprecruit.com",
            "https://www.maprecruit.ai"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const rateLimit = require('express-rate-limit');

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://map-recruit-ai-type-script.vercel.app",
        "https://maprecruit.ai",
        "https://*.maprecruit.com",
        "https://www.maprecruit.com",
        "https://www.maprecruit.ai"
    ],
    credentials: true
}));
app.use(limiter); // Apply global rate limiter
app.use(express.json({ limit: '10mb' })); // Support large JSON payloads for schemaless data

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// In-Memory State for Active Users
// Map structure: socketId -> { userId, firstName, lastName, avatar, campaignId, status, lastSeen }
const activeUsers = new Map();

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join-page', (data) => {
        const { campaignId, user } = data;
        if (!campaignId || !user) return;

        socket.join(campaignId);

        const userData = {
            ...user,
            campaignId,
            socketId: socket.id,
            status: 'active',
            lastSeen: new Date()
        };
        activeUsers.set(socket.id, { ...userData });

        // 1. Send initial sync list ONLY to the joining user
        const roomUsers = Array.from(activeUsers.values()).filter(u => u.campaignId === campaignId);
        socket.emit('room-sync', roomUsers);

        // 2. Broadcast ONLY the new user to others in the room
        socket.to(campaignId).emit('user-joined', userData);

        console.log(`User ${user.firstName} joined campaign ${campaignId}`);
    });

    socket.on('leave-page', (data) => {
        const { campaignId, userId } = data;
        if (!campaignId) return;

        socket.leave(campaignId);

        const user = activeUsers.get(socket.id);
        if (user && user.campaignId === campaignId) {
            activeUsers.delete(socket.id);

            // Broadcast ONLY the leaf event to the room
            io.to(campaignId).emit('user-left', { userId, socketId: socket.id });
            console.log(`User ${userId} left campaign ${campaignId}`);
        }
    });

    socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id);
        if (user) {
            const { campaignId, id: userId } = user;
            activeUsers.delete(socket.id);

            if (campaignId) {
                // Broadcast ONLY the leaf event to the room
                io.to(campaignId).emit('user-left', { userId, socketId: socket.id });
            }
            console.log(`User Disconnected: ${socket.id}`);
        }
    });

    socket.on('user-idle', (isIdle) => {
        const user = activeUsers.get(socket.id);
        if (user) {
            user.status = isIdle ? 'idle' : 'active';
            activeUsers.set(socket.id, user);

            // Broadcast status change ONLY
            io.to(user.campaignId).emit('user-updated', {
                userId: user.id || user.userId,
                socketId: socket.id,
                status: user.status
            });
        }
    });

    socket.on('heartbeat', () => {
        const user = activeUsers.get(socket.id);
        if (user) {
            user.lastSeen = new Date();
            activeUsers.set(socket.id, user); // Update timestamp
        }
    });
});

// Database Connection
const connectDB = async () => {
    // Check if we already have a connection
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Only exit if running standalone, otherwise throw to be caught by middleware
        if (require.main === module) {
            process.exit(1);
        } else {
            throw error;
        }
    }
};

// Middleware to ensure DB connection (Critical for Serverless/Vercel)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed in middleware:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});

// Middleware for Tenant Resolution (Must be after DB connection)
app.use(resolveTenant);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/workflows', require('./routes/workflowRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/owning-entities', require('./routes/owningEntityRoutes'));
app.use('/api/schemas', require('./routes/schemaRoutes'));
app.use('/api/user/integrations', require('./routes/integrationRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));

// Initialize Background Sync Scheduler
const syncService = require('./services/syncService');
syncService.init();

app.get('/api/debug', (req, res) => res.json({
    message: 'Backend is alive',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    rpID: process.env.RP_ID
}));

app.get('/', (req, res) => {
    res.send('MapRecruit Schema API is running...');
});


// 404 Handler for /api
app.use('/api', (req, res) => {
    console.warn(`API 404: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found`,
        availablePaths: [
            '/api/auth/register',
            '/api/auth/login',
            '/api/auth/me',
            '/api/auth/passkey/register-options',
            '/api/auth/passkey/register-verify',
            '/api/auth/passkey/login-options',
            '/api/auth/passkey/login-verify'
        ]
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    connectDB().then(() => {
        // Change app.listen to server.listen to support Socket.io
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app; // Note: For serverless, you might need to export 'server' or adapter
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
