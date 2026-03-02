# MapRecruit.ai

> AI-Powered Recruitment Platform with Advanced Talent Intelligence

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-25.x-339933.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

## 🚀 Overview

MapRecruit.ai is a next-generation recruitment platform that leverages AI and advanced analytics to streamline talent acquisition. Built with modern web technologies, it offers comprehensive candidate management, intelligent matching, and real-time collaboration features.

### Key Features

- 🎯 **AI-Powered Candidate Matching** - Intelligent algorithms to match candidates with job requirements
- 📊 **Advanced Analytics Dashboard** - Real-time insights into recruitment metrics and pipeline health
- 🔐 **Enterprise-Grade Security** - Multi-tenant architecture with strict data isolation and RBAC
- 💬 **Real-Time Collaboration** - WebSocket-based co-presence and live updates
- 🌐 **Multi-Language Support** - i18n integration for global teams
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Dynamic Theming** - Customizable brand colors and dark mode support

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18.3 with TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- React Router v7 (Navigation)
- Socket.IO Client (Real-time)
- Recharts (Data Visualization)
- TinyMCE (Rich Text Editor)

**Backend:**
- Node.js 25.x
- Express.js (API Framework)
- MongoDB Atlas (Database)
- Mongoose (ODM)
- Socket.IO (WebSocket Server)
- JWT (Authentication)
- Passport.js (OAuth Integration)

**Infrastructure:**
- Vercel (Frontend Hosting)
- Vercel Serverless Functions (Backend API)
- MongoDB Atlas (Database Hosting)
- GitHub Actions (CI/CD)

### Security Features

✅ **Tenant Isolation** - Strict client-level data segregation  
✅ **NoSQL Injection Prevention** - Input sanitization middleware  
✅ **Impersonation Safety** - Read-only mode with audit logging  
✅ **Session Management** - 30-minute inactivity timeout with heartbeat  
✅ **Rate Limiting** - 1000 requests per 15 minutes per IP  
✅ **CORS Protection** - Whitelist-based origin validation  

## 📦 Installation

### Prerequisites

- Node.js 18+ (Recommended: 25.x)
- npm or yarn
- MongoDB Atlas account
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/itsmepratikg/MapRecruit.ai-TypeScript.git
   cd MapRecruit.ai-TypeScript
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure environment variables**

   Create `.env` in the root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
   ```

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   RP_ID=localhost
   TINYMCE_API_KEY=your_tinymce_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_API_KEY=your_google_api_key
   ```

5. **Start development servers**

   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```

   Terminal 2 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚢 Deployment

### Frontend (Vercel)

The frontend is automatically deployed to Vercel on every push to the `main` branch.

**Manual Deployment:**
```bash
npm run build
vercel --prod
```

### Backend (Vercel Serverless)

The backend is deployed as Vercel Serverless Functions.

**Configuration:** See `backend/vercel.json`

## 📁 Project Structure

```
MapRecruit.ai-TypeScript/
├── .maprecruit-skills/      # Antigravity AI skills for development
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # API route controllers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   └── utils/               # Utility functions
├── components/              # React components
├── pages/                   # Page-level components
├── hooks/                   # Custom React hooks
├── context/                 # React Context providers
├── services/                # API service layer
├── utils/                   # Frontend utilities
├── src/                     # Additional source files
│   ├── i18n.ts             # Internationalization config
│   └── styles/             # Global styles
├── App.tsx                  # Main application component
├── index.tsx                # Application entry point
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.ts           # Vite build configuration
```

## 🔧 Configuration

### Tailwind CSS

Custom theme configuration with dynamic color variables:
- Primary color: Emerald (customizable via CSS variables)
- Dark mode: Class-based toggle
- Custom scrollbar styles
- Responsive breakpoints

### MongoDB Collections

- `usersDB` - User accounts and authentication
- `clientsDB` - Client/tenant information
- `campaignsDB` - Recruitment campaigns
- `resumesDB` - Candidate profiles
- `interviewsDB` - Interview scheduling
- `activitiesDB` - Audit logs and activity tracking

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Security audit scripts are located in `.trash/` (archived after execution).

## 🛡️ Security Audit

The project has undergone a comprehensive security audit addressing:
- ✅ Tenant isolation vulnerabilities (SEC-01, SEC-02)
- ✅ Global error handling (FRM-03)
- ✅ Profile controller security verification (REM-04)
- ✅ Payload size limits (REM-05)

See `audit_report.md` in the project artifacts for details.

## 🤝 Contributing

This is a proprietary project. For contribution guidelines, please contact the project maintainers.

## 📄 License

Proprietary - All rights reserved.

## 👥 Team

**Lead Developer:** Pratik Gaurav ([@itsmepratikg](https://github.com/itsmepratikg))

## 📞 Support

For support inquiries, please contact: [support@maprecruit.ai](mailto:support@maprecruit.ai)

---

**Built with ❤️ using Antigravity AI-assisted development**
