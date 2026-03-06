import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';

async function seed() {
    let content = fs.readFileSync('c:\\Users\\pratik\\MRv5-TSX\\MapRecruit.ai-TypeScript-\\.trash\\Schema_Data\\tagsCollection.json', 'utf8');

    // Remove comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // Split on valid object boundaries and wrap in array
    let docsStr = '[' + content.trim().replace(/}\s*\{/g, '},{') + ']';

    // Replace BSON syntax with standard JSON syntax
    docsStr = docsStr.replace(/ObjectId\("([^"]+)"\)/g, '{"$oid": "$1"}');
    docsStr = docsStr.replace(/ISODate\("([^"]+)"\)/g, '{"$date": "$1"}');

    let docs = JSON.parse(docsStr);

    // Convert logic to revive $oid and $date back to MongoDB objects
    const reviveBson = (obj) => {
        if (Array.isArray(obj)) return obj.map(reviveBson);
        if (obj && typeof obj === 'object') {
            if (obj.$oid) return new ObjectId(obj.$oid);
            if (obj.$date) return new Date(obj.$date);
            const newObj = {};
            for (const key in obj) {
                newObj[key] = reviveBson(obj[key]);
            }
            return newObj;
        }
        return obj;
    };

    docs = docs.map(reviveBson);

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    const db = client.db('MRv5');
    const collection = db.collection('tags');

    const ops = docs.map((doc) => ({
        updateOne: {
            filter: { _id: doc._id },
            update: { $set: doc },
            upsert: true
        }
    }));

    const result = await collection.bulkWrite(ops);
    console.log(`Successfully seeded tags collection.`);
    console.log(`Matched: ${result.matchedCount}, Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);

    await client.close();
}

seed().catch(console.error);
