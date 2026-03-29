import express from "express";
import { validate } from "../middleware/validate.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import Patient from "../model/Patient.js";

import passport from "passport";
import Doctor from "../model/Doctor.js";

const router = express.Router();

const signToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//doctor signup
router.post(
  "/doctor/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    try {
      const exists = await Doctor.findOne({ email: req.body.email });
      if (exists) {
        return res.badRequest("Doctor with this email is already exist");
      }

      const hashed = await bcrypt.hash(req.body.password, 10);

      const doc = await Doctor.create({
        ...req.body,
        password: hashed,
      });

      const token = signToken(doc._id, "doctor");
      res.created(
        { token, user: { id: doc._id, type: "doctor" } },
        "Doctor register successfully"
      );
    } catch (error) {
      res.serverError("Registration failed", [error.message]);
    }
  }
);

//doctor login
router.post(
  "/doctor/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  async (req, res) => {
    try {
      const doc = await Doctor.findOne({ email: req.body.email });
      if (!doc || !doc.password) {
        return res.unauthorized(
          "Doctor not exist with this email and password "
        );
      }

      const match = await bcrypt.compare(req.body.password, doc.password);

      const token = signToken(doc._id, "doctor");
      res.created(
        { token, user: { id: doc._id, type: "doctor" } },
        "Doctor Login successfully"
      );
    } catch (error) {
      res.serverError("Login failed", [error.message]);
    }
  }
);
//patient signup
router.post(
  "/patient/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    try {
      const exists = await Patient.findOne({ email: req.body.email });
      if (exists) {
        return res.badRequest("Patient with this email is already exist");
      }

      const hashed = await bcrypt.hash(req.body.password, 10);

      const pat = await Patient.create({
        ...req.body,
        password: hashed,
      });

      const token = signToken(pat._id, "patient");
      res.created(
        { token, user: { id: pat._id, type: "patient" } },
        "Patient register successfully"
      );
    } catch (error) {
      res.serverError("Registration failed", [error.message]);
    }
  }
);
//doctor login

router.post(
  "/patient/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  async (req, res) => {
    try {
      const pat = await Patient.findOne({ email: req.body.email });
      if (!pat || !pat.password) {
        return res.unauthorized(
          "patient not exist with this email and password "
        );
      }

      const match = await bcrypt.compare(req.body.password, pat.password);

      const token = signToken(pat._id, "patient");
      res.created(
        { token, user: { id: pat._id, type: "patient" } },
        "patient Login successfully"
      );
    } catch (error) {
      res.serverError("Login failed", [error.message]);
    }
  }
);

//google login

router.post("/google", (req, res, next) => {
  const userType = req.query.type || "patient";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: userType,
    prompt: "select_account",
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  async (req, res) => {
    try {
      const { user, type } = req.user;
      const token = signToken(user._id, type);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

      const redirectUrl = `${frontendUrl}/auth/success?token=${token}&type=${type}&user=${encodeURIComponent(
        JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        })
      )}`;

      res.redirect(redirectUrl);
    } catch (e) {
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(
          e.message
        )}`
      );
    }
  }
);

//auth failure

router.get("/failure", (req, res) => res.badRequest("Google Auth Failed"));

export default router;
