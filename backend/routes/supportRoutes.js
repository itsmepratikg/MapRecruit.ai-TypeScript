const express = require('express');
const router = express.Router();
const { submitSupportRequest } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitSupportRequest);

module.exports = router;
