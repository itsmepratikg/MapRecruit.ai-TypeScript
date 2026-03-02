const express = require('express');
const router = express.Router();
const {
    getCustomFieldsByCollection,
    getGroupedCustomFields,
    updateCustomDataField,
    updateCustomDataBatch
} = require('../controllers/customFieldController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:collection', protect, getCustomFieldsByCollection);
router.get('/grouped/:collection', protect, getGroupedCustomFields);
router.put('/update/:id', protect, updateCustomDataField);
router.post('/update-batch/:collection/:id', protect, updateCustomDataBatch);

module.exports = router;
