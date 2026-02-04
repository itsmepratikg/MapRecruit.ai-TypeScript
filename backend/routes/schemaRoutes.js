const express = require('express');
const router = express.Router();
const { getSchemaByName, listSchemas } = require('../controllers/schemaController');
const { protect } = require('../middleware/authMiddleware');

// All schema routes are protected
router.use(protect);

router.get('/', listSchemas);
router.get('/:name', getSchemaByName);

module.exports = router;
