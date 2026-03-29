import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import Patient from "../model/Patient.js";
import { body } from "express-validator";
import { computeAgeFromDob } from "../utils/date.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

//  Get Patient Profile

router.get("/me", authenticate, requireRole("patient"), async (req, res) => {
  try {
    // Logged-in user ke ID se patient ka data nikal rahe hain
    const patient = await Patient.findById(req.user._id).select(
      "-password -googleId"
    );
    res.ok(patient, "Profile Fetched");
  } catch (error) {
    res.serverError("Failed to fetch profile", [error.message]);
  }
});

//  Update Patient Profile

router.put(
  "/onboarding/update",
  authenticate,
  requireRole("patient"),
  [
    body("name").optional().notEmpty(),
    body("phone").optional().isString(),
    body("dob").optional().isISO8601(),
    body("age").optional().notEmpty(),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("bloodGroup").optional().isString(),
    body("emergencyContact").optional().isObject(),
    body("emergencyContact.name").optional().isString().notEmpty(),
    body("emergencyContact.phone").optional().isString().notEmpty(),
    body("emergencyContact.relationship").optional().isString().notEmpty(),
    body("medicalHistory").optional().isObject(),
    body("medicalHistory.allergies").optional().isString().notEmpty(),
    body("medicalHistory.currentMedications").optional().isString().notEmpty(),
    body("medicalHistory.chronicConditions").optional().isString().notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const updated = { ...req.body };

      // Agar dob diya gaya ho, to automatically age calculate karo
      if (updated.dob) {
        updated.age = computeAgeFromDob(updated.dob);
      }

      delete updated.password;
      updated.isVerified = true;

      // Patient profile update kar rahe hain
      const patient = await Patient.findByIdAndUpdate(req.user._id, updated, {
        new: true,
      }).select("-password -googleId");

      res.ok(patient, "Profile updated");
    } catch (error) {
      console.error("Update failed:", error);
      res.serverError("Update failed", [error.message]);
    }
  }
);

export default router;
