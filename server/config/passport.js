import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import Doctor from "../model/Doctor.js";
import Patient from "../model/Patient.js";

dotenv.config();

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },

    //  Verify callback
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        //  Determine if user is a doctor or patient
        const userType = req.query.state || "patient";

        // 2️ Extract user info from Google profile
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const photo = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        //  Doctor Login / Signup flow
        if (userType === "doctor") {
          let user = await Doctor.findOne({ email });

          if (!user) {
            user = await Doctor.create({
              googleId: profile.id,
              email,
              name,
              profileImage: photo,
              isVerified: true,
            });
          } else {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.profileImage = photo;
              await user.save();
            }
          }

          return done(null, { user, type: "doctor" });
        }

        //  Patient Login / Signup flow
        else {
          let user = await Patient.findOne({ email });

          if (!user) {
            user = await Patient.create({
              googleId: profile.id,
              email,
              name,
              profileImage: photo,
              isVerified: true,
            });
          } else {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.profileImage = photo;
              await user.save();
            }
          }

          return done(null, { user, type: "patient" });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
