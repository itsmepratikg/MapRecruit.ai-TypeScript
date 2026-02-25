const express = require('express');
const router = express.Router();
const {
    getStatus,
    handleGoogleCallback,
    handleMicrosoftCallback,
    disconnect,
    getPickerToken,
    fetchDriveFile,
    fetchMicrosoftFile,
    syncCalendar,
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteSpecificCalendarEvent,
    syncAll,
    syncProfilePhoto
} = require('../controllers/integrationController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStatus);
router.post('/sync', protect, syncAll);
router.get('/tokens/google', protect, getPickerToken);
router.post('/google/callback', protect, handleGoogleCallback);
router.post('/google/drive/fetch', protect, fetchDriveFile);
router.post('/microsoft/callback', protect, handleMicrosoftCallback);
router.post('/microsoft/drive/fetch', protect, fetchMicrosoftFile);
router.post('/google/calendar/sync', protect, syncCalendar);
router.get('/google/calendar/events', protect, getCalendarEvents);
router.post('/google/calendar/events', protect, createCalendarEvent);
router.put('/google/calendar/events/:eventId', protect, updateCalendarEvent);
router.delete('/google/calendar/events/:eventId', protect, deleteSpecificCalendarEvent);
router.get('/profile-photo/:provider', protect, syncProfilePhoto);
router.delete('/:provider', protect, disconnect);


module.exports = router;
