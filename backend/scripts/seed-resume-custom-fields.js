// backend/scripts/seed-resume-custom-fields.js
const { MongoClient, ObjectId } = require('mongodb');

// Same DB config
const uri = "mongodb://localhost:27017";
const dbName = "MRv5";
const COMPANY_ID = "6112806bc9147f673d28c6eb";

async function seedResumeCustomFields() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB successfully for Resume Updates");
        const db = client.db(dbName);
        const resumesCollection = db.collection('resumesDB');

        // Note: The specific field IDs for resumes would normally come from the schema API or layout mapping.
        // For the sake of this migration, we are deriving realistic plausible field structures based on standard use-cases:
        // Examples: Resume Stage, Is Background Verified, Expected Salary, Visa Status etc.

        const resumeFieldsToSeed = {
            "71f8b05616f737e4244c0001": { name: "Resume Stage", type: "Drop Down", options: ["Sourced", "Screening", "Interview", "Offer", "Hired"] },
            "71f8aec52d88d2f70b790002": { name: "Background Checked", type: "Drop Down", options: ["Pending", "Cleared", "Failed"] },
            "71f8aecd2d88d2f70b790003": { name: "Expected Salary", type: "Integer", format: "Number" },
            "71f8aed516f737e4244c0004": { name: "Visa Status", type: "Drop Down", options: ["US Citizen", "Green Card", "H1B", "OPT", "Other"] },
            "71f8aeeb16f737e4244c0005": { name: "Notes", type: "Text", format: "Text" }
        };

        const companyObjId = new ObjectId(COMPANY_ID);
        // Find resumes connected to this company
        // If clientID is not directly on resumes, we might have to filter broadly, but ideally it is.
        // Check both object id and string formatting as resumes DB can sometimes be messy
        const query = {
            $or: [
                { clientID: companyObjId },
                { clientID: companyObjId.toString() },
                { clientId: companyObjId.toString() }
            ]
        };

        const resumes = await resumesCollection.find(query).limit(100).toArray(); // Batch processing to test 100 first
        console.log(`Found ${resumes.length} resumes matching Company ${COMPANY_ID} (Limiting to 100)`);

        let updatedCount = 0;

        for (const resume of resumes) {
            let customData = resume.customData || {};
            // Ensure company sub-object exists
            if (!customData[COMPANY_ID]) {
                customData[COMPANY_ID] = {};
            }

            let needsUpdate = false;

            for (const [fieldId, config] of Object.entries(resumeFieldsToSeed)) {
                if (!customData[COMPANY_ID][fieldId]) {

                    let valToSet = null;
                    if (config.type === "Drop Down" && config.options) {
                        valToSet = config.options[Math.floor(Math.random() * config.options.length)];
                    } else if (config.type === "Integer") {
                        valToSet = Math.floor(Math.random() * (150000 - 60000 + 1) + 60000); // 60k - 150k
                    } else if (config.type === "Text") {
                        valToSet = "Candidate shows strong potential for leadership roles.";
                    }

                    customData[COMPANY_ID][fieldId] = {
                        name: config.name,
                        value: valToSet,
                        isDirty: false
                    };
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await resumesCollection.updateOne(
                    { _id: resume._id },
                    { $set: { customData: customData } }
                );
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} resumes with custom field structures.`);

    } catch (error) {
        console.error("Error during resume seeding process:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

seedResumeCustomFields();
