const express = require('express');
const router = express.Router();
const { getEmails } = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEmails);

module.exports = router;
