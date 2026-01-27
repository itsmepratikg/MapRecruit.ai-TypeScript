const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const SCHEMAS = {
    usersDB: {
        email: 'string',
        role: 'string',
        roleID: 'objectid',
        companyID: 'objectid',
        AccessibleCompanyID: 'array',
        clientID: 'array',
        activeClientID: 'objectid',
        currentCompanyID: 'objectid'
    },
    companiesDB: {
        companyProfile: 'object',
        productSettings: 'object',
        status: 'string'
    },
    clientsdb: {
        clientName: 'string',
        companyID: 'objectid',
        enable: 'boolean'
    },
    roles: {
        roleName: 'string',
        companyID: 'array',
        accessibilitySettings: 'object'
    },
    franchises: {
        franchiseName: 'string',
        companyID: 'objectid',
        clientIDs: 'array',
        active: 'boolean'
    },
    resumesDB: {
        clientID: 'array', // User said Array is okay for now
        companyID: 'objectid',
        franchiseID: 'objectid'
    },
    campaignsDB: {
        clientID: 'objectid',
        companyID: 'objectid'
    },
    owningentities: {
        name: 'string',
        companyID: 'objectid',
        clientIDs: 'array'
    },
    InterviewsDB: {
        resumeID: 'objectid',
        campaignID: 'objectid',
        companyID: 'objectid',
        clientID: 'objectid',
        userID: 'objectid'
    },
    workflowsDB: {
        companyID: 'objectid',
        campaignID: 'objectid',
        name: 'string'
    },
    activitiesDB: {
        companyID: 'objectid',
        userID: 'objectid',
        type: 'string'
    }
};

const getType = (val) => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return 'array';
    if (val instanceof ObjectId || (val && val._bsontype === 'ObjectID')) return 'objectid';
    if (typeof val === 'object') return 'object';
    return typeof val;
};

const runVerification = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        console.log('\n🔍 Starting FULL Database Key and Type Verification (11 Collections)...\n');

        const fullReport = {};

        for (const [collName, schema] of Object.entries(SCHEMAS)) {
            console.log(`Checking collection: ${collName}...`);
            const cursor = db.collection(collName).find({});
            const docs = await cursor.toArray();

            const stats = {
                totalDocuments: docs.length,
                keyPresence: {},
                typeValidation: {}
            };

            if (docs.length === 0) {
                stats.isEmpty = true;
            } else {
                for (const doc of docs) {
                    for (const [key, expectedType] of Object.entries(schema)) {
                        // Check Presence
                        if (!(key in doc)) {
                            stats.keyPresence[key] = (stats.keyPresence[key] || 0) + 1;
                        }

                        // Check Type
                        const actualType = getType(doc[key]);
                        if (actualType !== 'undefined') {
                            if (actualType !== expectedType) {
                                const errorKey = `${key} (${actualType} != ${expectedType})`;
                                stats.typeValidation[errorKey] = (stats.typeValidation[errorKey] || 0) + 1;
                            }
                        }
                    }
                }
            }
            fullReport[collName] = stats;
        }

        console.log('\n--- FULL VERIFICATION REPORT ---\n');
        for (const [coll, data] of Object.entries(fullReport)) {
            console.log(`Collection: ${coll} (${data.totalDocuments} docs)`);

            if (data.isEmpty) {
                console.log('  ⚠️ COLLECTION IS EMPTY');
                console.log('');
                continue;
            }

            const missingKeys = Object.entries(data.keyPresence);
            if (missingKeys.length > 0) {
                console.log('  ❌ Missing Keys:');
                missingKeys.forEach(([k, count]) => {
                    console.log(`     - ${k}: Missing in ${count} documents`);
                });
            } else {
                console.log('  ✅ All standardized keys present');
            }

            const typeErrors = Object.entries(data.typeValidation);
            if (typeErrors.length > 0) {
                console.log('  ❌ Type Mismatches:');
                typeErrors.forEach(([k, count]) => {
                    console.log(`     - ${k}: Found in ${count} documents`);
                });
            } else {
                console.log('  ✅ All key types match the expected schema');
            }
            console.log('');
        }

        process.exit(0);
    } catch (e) {
        console.error('Verification Failed:', e.message);
        process.exit(1);
    }
};

runVerification();
