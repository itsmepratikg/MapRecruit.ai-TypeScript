const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Use absolute path for .env
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'Yes' : 'No');

// Standardize models path
const CustomSection = require('../models/CustomSection');
const CustomField = require('../models/CustomField');

async function syncLayouts() {
    try {
        console.log('Connecting to MongoDB...');
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in environment variables');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', mongoose.connection.name);
        console.log('Connection readyState:', mongoose.connection.readyState);

        const files = [
            { path: '../../.trash/SchemaData/ProfileLayouts/spherionprofilecustomlayout.json', page: 'profile', collection: 'resumes' },
            { path: '../../.trash/SchemaData/ProfileLayouts/trcprofilecustomlayouts.json', page: 'profile', collection: 'resumes' },
            { path: '../../.trash/SchemaData/ProfileLayouts/spherioncampaigncustomlayouts.JSON', page: 'jobDescription', collection: 'campaigns' },
            { path: '../../.trash/SchemaData/ProfileLayouts/trccampaigncutomlayouts.json', page: 'jobDescription', collection: 'campaigns' }
        ];

        for (const file of files) {
            const fullPath = path.join(__dirname, file.path);
            await processFile(fullPath, file.page, file.collection);
        }

        console.log('\nSync completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during sync:', error);
        process.exit(1);
    }
}

async function processFile(filePath, page, collectionName) {
    console.log(`\n--- Processing ${path.basename(filePath)} for page "${page}" ---`);

    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Clean up MongoDB Extended JSON (ObjectId, ISODate) to make it parsable
    content = content.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
    content = content.replace(/ISODate\("([^"]+)"\)/g, '"$1"');
    // Remove comments
    content = content.replace(/\/\* \d+ \*\//g, '');

    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        // If it's a list of objects without square brackets
        try {
            data = JSON.parse(`[${content.replace(/\}\s*\{/g, '},{')}]`);
        } catch (e2) {
            console.error(`Failed to parse JSON from ${filePath}:`, e2.message);
            return;
        }
    }

    const layouts = Array.isArray(data) ? data : [data];
    console.log(`Found ${layouts.length} layouts in file.`);

    for (const doc of layouts) {
        const companyID = doc.companyID;
        if (!companyID) continue;

        // The layout object might have different keys
        const layoutObj = doc.layout || {};
        const profileLayout = layoutObj.completeProfile || {};
        const campaignLayout = layoutObj.completeJobDescription || {};

        const sections = (profileLayout.sections || campaignLayout.sections || []);

        if (sections.length === 0) {
            // Check top level layout.sections if any
            if (layoutObj.sections) {
                sections.push(...layoutObj.sections);
            }
        }

        console.log(`Processing ${sections.length} sections for Company: ${companyID}`);

        for (const section of sections) {
            if (section.sectionType === 'Custom') {
                const sectionName = section.sectionName || section.sectionCode || 'Custom Section';
                console.log(`  Syncing Custom Section: "${sectionName}"`);

                // Upsert Section
                let sectionDoc = await CustomSection.findOneAndUpdate(
                    {
                        companyID: new mongoose.Types.ObjectId(companyID),
                        page,
                        name: sectionName
                    },
                    {
                        $set: {
                            enabled: true,
                            order: section.order || 1,
                            accessLevel: section.accessLevel || 'Company',
                            sectionType: 'Custom'
                        }
                    },
                    { upsert: true, new: true }
                );

                // Link Fields
                const rows = section.rows || [];
                let linkedCount = 0;
                for (const row of rows) {
                    const columns = row.columns || [];
                    for (const col of columns) {
                        if (col.fieldType === 'Custom' && col.fieldID) {
                            const result = await CustomField.findOneAndUpdate(
                                { _id: new mongoose.Types.ObjectId(col.fieldID) },
                                {
                                    $set: {
                                        sectionID: sectionDoc._id,
                                        collectionName: collectionName
                                    }
                                },
                                { new: true }
                            );
                            if (result) linkedCount++;
                        }
                    }
                }
                if (linkedCount > 0) {
                    console.log(`    Linked ${linkedCount} fields to section "${sectionName}" (${sectionDoc._id})`);
                }
            }
        }
    }
}

syncLayouts();
