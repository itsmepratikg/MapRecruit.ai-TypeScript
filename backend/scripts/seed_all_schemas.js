const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Schema = require('../models/Schema');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedSchemas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const schemaFilePath = path.join(__dirname, '..', '..', 'allSchema.json');
        if (!fs.existsSync(schemaFilePath)) {
            console.error('File allSchema.json not found at:', schemaFilePath);
            process.exit(1);
        }

        const rawData = fs.readFileSync(schemaFilePath, 'utf8');
        const unifiedSchema = JSON.parse(rawData);

        if (!unifiedSchema.schemas) {
            console.error('Invalid allSchema.json structure: missing "schemas" key');
            process.exit(1);
        }

        const schemasToSeed = unifiedSchema.schemas;
        const schemaNames = Object.keys(schemasToSeed);
        console.log(`Found ${schemaNames.length} schemas to seed:`, schemaNames);

        for (const name of schemaNames) {
            const config = schemasToSeed[name];

            await Schema.findOneAndUpdate(
                { name },
                {
                    name,
                    config,
                    description: config.description || `Schema for ${name}`
                },
                { upsert: true, new: true }
            );
            console.log(`Seeded schema: ${name}`);
        }

        console.log('All schemas seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedSchemas();
