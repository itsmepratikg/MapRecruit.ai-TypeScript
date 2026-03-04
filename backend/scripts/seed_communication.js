
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const CommunicationSender = require('../models/CommunicationSender');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Read cleaned JSON
        const filePath = path.join(__dirname, '..', '..', 'tmp', 'clean_comm.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`Clearing existing communication senders (optional)...`);
        // await CommunicationSender.deleteMany({}); // Uncomment if you want to wipe & start fresh

        console.log(`Preparing to insert ${data.length} documents...`);

        // Insert in batches to avoid any issues
        const batchSize = 100;
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            await CommunicationSender.insertMany(batch);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
