
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
require('dotenv').config();

// Google OAuth2 Strategy --------------------------------------------------------------
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: process.env.GOOGLE_CALLBACK_URL, 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find an existing user by Google profile ID
        let user = await User.findOne({ googleId: profile.id });

        // If no user exists, create a new user
        if (!user) {
            user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
                profileImage: profile.photos[0].value, // Use Google profile image
                isVerified: true, // Google users are automatically verified
            });
            await user.save();
        }

        done(null, user); 
    } catch (error) {
        done(error, null);
    }
}));


// JWT Strategy --------------------------------------------------------------
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies.jwt,
    ]),
    secretOrKey: process.env.JWT_SECRET, 
}, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.userId);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;