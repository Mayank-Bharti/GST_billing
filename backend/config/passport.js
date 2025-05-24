import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
            // Inform user Google login linked
            return done(null, { 
              user, 
              token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
              message: "Existing account found. Linked Google login."
            });
          } else {
            // Google login already linked
            return done(null, {
              user,
              token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
              message: "Login successful via Google."
            });
          }
        } else {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            role: "staff",
          });
          return done(null, {
            user,
            token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
            message: "New user created and logged in via Google."
          });
        }
      } catch (err) {
        done(err, false);
      }
    }
  )
);
// Serialize/Deserialize
passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser((data, done) => {
  done(null, data);
});
