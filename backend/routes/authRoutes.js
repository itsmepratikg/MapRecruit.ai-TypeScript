const express = require('express');
const passport = require('../config/passport');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    listRoles,
    createRole,
    updateRole,
    deleteRole,
    switchCompany,
    googleLogin,
    googleOAuthCallback,
    microsoftOAuthCallback
} = require('../controllers/authController');
const {
    getRegistrationOptions,
    verifyRegistration,
    getAuthenticationOptions,
    verifyLogin
} = require('../controllers/passkeyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.post('/switch-context', protect, switchCompany);

// Passport OAuth Routes
router.get('/google/oauth', passport.authenticate('google', { accessType: 'offline', prompt: 'consent' }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleOAuthCallback);

router.get('/microsoft/oauth', passport.authenticate('microsoft', { prompt: 'select_account' }));
router.get('/microsoft/callback', passport.authenticate('microsoft', { failureRedirect: '/login' }), microsoftOAuthCallback);

// Passkey Routes
router.post('/passkey/register-options', protect, getRegistrationOptions);
router.post('/passkey/register-verify', protect, verifyRegistration);
router.post('/passkey/login-options', getAuthenticationOptions);
router.post('/passkey/login-verify', verifyLogin);

// Role Management Routes
router.route('/roles')
    .get(protect, listRoles)
    .post(protect, createRole);
router.route('/roles/:id')
    .put(protect, updateRole)
    .delete(protect, deleteRole);

// Role Hierarchy Routes
const { getHierarchy, updateHierarchy } = require('../controllers/roleHierarchyController');
router.route('/roles/hierarchy')
    .get(protect, getHierarchy)
    .post(protect, updateHierarchy);

// Impersonation Route
router.post('/impersonate', protect, require('../controllers/authController').impersonateUser);

module.exports = router;
