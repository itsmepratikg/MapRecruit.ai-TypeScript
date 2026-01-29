const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path
const dotenv = require('dotenv');
dotenv.config();

const userId = "696a1d32e8ceec1d15098204"; // From token

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findById(userId);
        if (user) {
            console.log(`User Found: ${user.name} (${user.email})`);
        } else {
            console.log(`User NOT Found: ${userId}`);

            // Search by email to see if ID changed
            const emailUser = await User.findOne({ email: process.env.TEST_EMAIL || "pratik.gaurav@maprecruit.ai" });
            if (emailUser) {
                console.log(`User found by email, but ID is: ${emailUser._id}`);
            }
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
