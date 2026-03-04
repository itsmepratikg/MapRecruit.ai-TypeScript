
const express = require('express');
const router = express.Router();
const communicationSenderController = require('../controllers/communicationSenderController');
const { protect } = require('../middleware/authMiddleware'); // assuming this exists based on pattern

router.route('/')
    .get(protect, communicationSenderController.getAll)
    .post(protect, communicationSenderController.create);

router.route('/my/senders')
    .get(protect, communicationSenderController.getMySenders);

router.route('/my/defaults')
    .put(protect, communicationSenderController.updateMyDefaults);

router.route('/:id')
    .get(protect, communicationSenderController.getById)
    .put(protect, communicationSenderController.update)
    .delete(protect, communicationSenderController.delete);

router.post('/:id/verify', protect, communicationSenderController.verifyPostmark);

module.exports = router;
