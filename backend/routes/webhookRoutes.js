const express = require('express');
const router = express.Router();
const { handleGooglePush, handleMicrosoftPush } = require('../controllers/webhookController');

// Note: These routes are public as they are called by Google/Microsoft
// In production, you would verify signatures or use a secret token in the URL.
router.post('/google', handleGooglePush);
router.post('/microsoft', handleMicrosoftPush);

module.exports = router;
