const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Replace these values with your actual Google credentials
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URI;

// Define your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
    },
    function (accessToken, refreshToken, profile, cb) {
      // You can create or find a user in your database here
      // For simplicity, we'll just pass the profile to the callback
      return cb(null, profile);
    }
  )
);

// Configure JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    function (payload, done) {
      // Here you would typically check if the user exists in your database
      // and if the token is still valid
      return done(null, payload);
    }
  )
);

// Function to initialize Passport
const initializePassport = (app) => {
  // Initialize Passport middleware
  app.use(passport.initialize());
};

module.exports = { initializePassport };
