const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly']
    },
        (accessToken, refreshToken, profile, done) => {
            const user = { provider: 'google', profile, accessToken, refreshToken };
            return done(null, user);
        }));
}

if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/api/auth/microsoft/callback',
        scope: ['user.read', 'mail.read', 'offline_access'],
        tenant: 'common' // Or specific tenant if required
    },
        (accessToken, refreshToken, profile, done) => {
            const user = { provider: 'microsoft', profile, accessToken, refreshToken };
            return done(null, user);
        }));
}

module.exports = passport;
