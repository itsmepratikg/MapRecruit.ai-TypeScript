const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const runMigration = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        console.log('\n🚀 Starting Database Standardization Migration...\n');

        // --- 1. MIGRATING InterviewsDB ---
        console.log('--- Processing InterviewsDB ---');
        const interviews = await db.collection('InterviewsDB').find({}).toArray();
        console.log(`Found ${interviews.length} documents in InterviewsDB`);

        for (const doc of interviews) {
            const update = {};
            const toConvert = ['resumeID', 'campaignID', 'companyID', 'clientID', 'userID'];

            // Handle ID fields
            toConvert.forEach(key => {
                if (doc[key] && typeof doc[key] === 'string' && doc[key].length === 24) {
                    update[key] = new ObjectId(doc[key]);
                }
            });

            // Re-map the document with ObjectId _id
            // Since we can't update _id in place, we must delete and re-insert if it's a string
            if (typeof doc._id === 'string' && doc._id.length === 24) {
                const newId = new ObjectId(doc._id);
                const newDoc = { ...doc, ...update, _id: newId };

                await db.collection('InterviewsDB').deleteOne({ _id: doc._id });
                await db.collection('InterviewsDB').insertOne(newDoc);
                console.log(`Converted Interview _id: ${doc._id} to ObjectId`);
            } else if (Object.keys(update).length > 0) {
                await db.collection('InterviewsDB').updateOne({ _id: doc._id }, { $set: update });
                console.log(`Updated Interview fields for _id: ${doc._id}`);
            }
        }

        // --- 2. MIGRATING owningentities ---
        console.log('\n--- Processing owningentities ---');
        const entities = await db.collection('owningentities').find({}).toArray();
        console.log(`Found ${entities.length} documents in owningentities`);

        for (const doc of entities) {
            const update = {};
            let clientIDs = doc.clientIDs || [];

            // Flatten nested arrays if they exist (saw [["id"]] in sample) and convert to ObjectId
            let flatClientIDs = clientIDs.flat().filter(id => id && typeof id === 'string' && id.length === 24).map(id => new ObjectId(id));
            update.clientIDs = flatClientIDs;

            // Infer companyID from FIRST client if missing
            if (!doc.companyID && flatClientIDs.length > 0) {
                const firstClient = await db.collection('clientsdb').findOne({ _id: flatClientIDs[0] });
                if (firstClient && firstClient.companyID) {
                    update.companyID = firstClient.companyID;
                    console.log(`Inferred companyID: ${update.companyID} for entity: ${doc.name}`);
                }
            }

            if (Object.keys(update).length > 0) {
                await db.collection('owningentities').updateOne({ _id: doc._id }, { $set: update });
                console.log(`Standardized owningentity: ${doc.name}`);
            }
        }

        console.log('\n✅ MIGRATION COMPLETE\n');
        process.exit(0);
    } catch (e) {
        console.error('Migration Failed:', e.message);
        process.exit(1);
    }
};

runMigration();
