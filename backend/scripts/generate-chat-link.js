const jwt = require('jsonwebtoken');

const CHAT_SECRET = process.env.JWT_SECRET || 'fallback_chat_dev_secret_maprecruit';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const spaceName = 'spaces/AAAA1234567';
const displayName = 'MapRecruit Dev Team';

const linkToken = jwt.sign(
    { spaceId: spaceName, spaceDisplayName: displayName },
    CHAT_SECRET,
    { expiresIn: '15m' }
);

const linkUrl = `${FRONTEND_URL}/myaccount/usernotifications/googlechat?token=${linkToken}`;

console.log("\n=================================");
console.log("   GOOGLE CHAT MAGIC LINK TEST   ");
console.log("=================================\n");
console.log("Click this link to test the frontend integration:\n");
console.log(linkUrl);
console.log("\nToken Decodes To:", jwt.decode(linkToken));
console.log("\nNote: Make sure your frontend is running and you are logged in!");
