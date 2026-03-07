const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Client = require('./models/Client');

async function testMongoose() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/MRv5');
        const clientId = '6901bde590298a71b8360d61';

        console.log('Searching for clientId:', clientId);
        const client = await Client.findById(clientId);

        if (client) {
            console.log('SUCCESS: Client found via Mongoose model!');
            console.log('Client Name:', client.clientName);
        } else {
            console.log('FAILURE: Client NOT found via Mongoose model.');

            // Try raw query on the same connection
            const raw = await mongoose.connection.collection('clientsdb').findOne({ _id: new mongoose.Types.ObjectId(clientId) });
            if (raw) {
                console.log('Wait, raw query FOUND it! Mongoose model is misconfigured?');
                console.log('Raw _id:', raw._id);
                console.log('Raw _id type:', typeof raw._id);
            } else {
                console.log('Raw query NOT found it either.');
            }
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

testMongoose();
