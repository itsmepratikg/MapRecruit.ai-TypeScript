// backend/scripts/seed-custom-fields.js
const { MongoClient, ObjectId } = require('mongodb');

// MapRecruit.ai MongoDB Connection string mapping based on typical config
// Adjust if running in production
const uri = "mongodb://localhost:27017";
const dbName = "MRv5";
const COMPANY_ID = "6112806bc9147f673d28c6eb";

async function seedCustomFields() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB successfully");
        const db = client.db(dbName);
        const campaignsCollection = db.collection('campaignsDB');

        // Fields derived from layout_schema.json Custom sections
        const fieldsToSeed = {
            "63f8b05616f737e4244c0677": { type: "Drop Down", default: "Active", options: ["Active", "Pipeline", "Pending Lead", "Lost"] }, // Pipeline
            "63f8aec52d88d2f70b797f25": { type: "Drop Down", default: "Yes", options: ["Yes", "No"] }, // AppCast
            "63f8aecd2d88d2f70b797f28": { type: "Drop Down", default: "No", options: ["Yes", "No"] }, // LinkedIn
            "63f8aed516f737e4244c0628": { type: "Drop Down", default: "To Review", options: ["To Review", "Approved", "Rejected"] }, // TRC Front Office
            "63f8aeeb16f737e4244c0630": { type: "Text", default: "No Additional Requirements" }, // Additional Information
            "64f8aef216f737e4244c0634": { type: "Text", default: "123 Main St, Remote" }, // Street Address
            "64f8aefb16f737e4244c0637": { type: "Date", default: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // Estimated End Date
            "65f8af0516f737e4244c063a": { type: "Text", default: "Parent Corp Inc." } // Parent Account
        };

        const companyObjId = new ObjectId(COMPANY_ID);
        // Find campaigns for this company
        const campaigns = await campaignsCollection.find({ clientID: companyObjId.toString() }).toArray();
        console.log(`Found ${campaigns.length} campaigns for Company ${COMPANY_ID}`);

        let updatedCount = 0;

        for (const campaign of campaigns) {
            let customData = campaign.customData || {};
            // Ensure company sub-object exists
            if (!customData[COMPANY_ID]) {
                customData[COMPANY_ID] = {};
            }

            let needsUpdate = false;

            for (const [fieldId, config] of Object.entries(fieldsToSeed)) {
                // Only seed if it does not already exist
                if (!customData[COMPANY_ID][fieldId]) {
                    let valToSet = config.default;
                    if (config.type === "Drop Down" && config.options) {
                        // Randomly select one of the options to make seed data look realistic
                        valToSet = config.options[Math.floor(Math.random() * config.options.length)];
                    }

                    customData[COMPANY_ID][fieldId] = {
                        value: valToSet,
                        isDirty: false
                    };
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await campaignsCollection.updateOne(
                    { _id: campaign._id },
                    { $set: { customData: customData } }
                );
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} campaigns with custom field structures.`);

    } catch (error) {
        console.error("Error during seeding process:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

seedCustomFields();
