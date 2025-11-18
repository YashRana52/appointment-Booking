import express from "express";
import Appointment from "../model/Appointment.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import { query, body } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// ---------------- Doctor Appointments ----------------
router.get(
  "/doctor",
  authenticate,
  requireRole("doctor"),
  [
    query("status").optional().isArray().withMessage("Status can be an array"),
    query("status.*")
      .optional()
      .isString()
      .withMessage("Each status must be a string"),
  ],
  validate,
  async (req, res) => {
    try {
      const { status } = req.query;
      const filter = { doctorId: req.auth.id };

      if (status) {
        const statusArray = Array.isArray(status) ? status : [status];
        filter.status = { $in: statusArray };
      }

      const appointments = await Appointment.find(filter)
        .populate("patientId", "name email phone dob age profileImage")
        .populate("doctorId", "name fees phone specialization profileImage")
        .sort({ slotStartIso: 1 });

      res.ok(appointments, "Appointments fetched successfully");
    } catch (error) {
      console.error("Doctor appointment fetch error:", error);
      res.serverError("Failed to fetch appointments", error.message);
    }
  }
);

// ---------------- Patient Appointments ----------------
router.get(
  "/patient",
  authenticate,
  requireRole("patient"),
  [
    query("status").optional().isArray().withMessage("Status can be an array"),
    query("status.*")
      .optional()
      .isString()
      .withMessage("Each status must be a string"),
  ],
  validate,
  async (req, res) => {
    try {
      const { status } = req.query;
      const filter = { patientId: req.auth.id };

      if (status) {
        const statusArray = Array.isArray(status) ? status : [status];
        filter.status = { $in: statusArray };
      }

      const appointments = await Appointment.find(filter)
        .populate(
          "doctorId",
          "name fees phone specialization hospitalInfo profileImage"
        )
        .populate("patientId", "name email profileImage")
        .sort({ slotStartIso: 1 });

      res.ok(appointments, "Appointments fetched successfully");
    } catch (error) {
      console.error("Patient appointment fetch error:", error);
      res.serverError("Failed to fetch appointments", error.message);
    }
  }
);

// ---------------- Get Booked Slots ----------------
router.get("/booked-slots/:doctorId/:date", async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const startDay = new Date(date);
    startDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointment = await Appointment.find({
      doctorId,
      slotStartIso: { $gte: startDay, $lte: endOfDay },
      status: { $ne: "Cancelled" },
    }).select("slotStartIso");

    const bookedSlot = bookedAppointment.map((apt) => apt.slotStartIso);
    res.ok(bookedSlot, "Booked slots retrieved successfully");
  } catch (error) {
    res.serverError("Failed to fetch booked slots", error.message);
  }
});

// ---------------- Book Appointment ----------------
router.post(
  "/book",
  authenticate,
  requireRole("patient"),
  [
    body("doctorId").isMongoId().withMessage("Valid doctorId is required"),
    body("slotStartIso")
      .isISO8601()
      .withMessage("Valid start time is required"),
    body("slotEndIso").isISO8601().withMessage("Valid end time is required"),
    body("consultationType")
      .isIn(["Video Consultation", "Voice Call"])
      .withMessage("Valid consultation type is required"),
    body("symptoms")
      .isString()
      .isLength({ min: 10 })
      .withMessage("Symptoms description must be at least 10 characters"),
    body("consultationFees")
      .isNumeric()
      .withMessage("consultationFees is required"),
    body("platformFees").isNumeric().withMessage("platformFees is required"),
    body("totalAmount").isNumeric().withMessage("totalAmount is required"),
  ],
  validate,
  async (req, res) => {
    try {
      console.log("Incoming Body => ", req.body); // 🔥 LOG ADDED HERE

      const {
        doctorId,
        slotStartIso,
        slotEndIso,
        consultationType,
        symptoms,
        consultationFees,
        platformFees,
        totalAmount,
      } = req.body;

      const date = new Date(slotStartIso);

      // Check for conflicting slot
      const conflictingAppointment = await Appointment.findOne({
        doctorId,
        status: { $in: ["Scheduled", "In progress"] },
        $or: [
          {
            slotStartIso: { $lt: new Date(slotEndIso) },
            slotEndIso: { $gt: new Date(slotStartIso) },
          },
        ],
      });

      if (conflictingAppointment) {
        return res.forbidden("This time slot is already booked");
      }

      // Generate unique room ID
      const zegoRoomId = `room_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      const appointment = new Appointment({
        doctorId,
        patientId: req.auth.id,
        date,
        slotStartIso: new Date(slotStartIso),
        slotEndIso: new Date(slotEndIso),
        consultationType,
        symptoms,
        consultationFees,
        platformFees,
        totalAmount,
        paymentStatus: "Pending",
        payoutStatus: "Pending",
        zegoRoomId: zegoRoomId,
      });

      await appointment.save();

      await appointment.populate(
        "doctorId",
        "name fees phone specialization hospitalInfo profileImage"
      );
      await appointment.populate("patientId", "name email");

      res.created(appointment, "Appointment booked successfully");
    } catch (error) {
      console.log("BOOK ERROR => ", error.message); // 🔥 LOG ADDED HERE
      console.error("Appointment booking error:", error);
      res.serverError("Failed to book appointment", error.message);
    }
  }
);

//Get single appointment by id

router.get("/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email phone dob age profileImage")
      .populate(
        "doctorId",
        "name fees phone specialization profileImage hospitalInfo"
      );

    if (!appointment) {
      return res.notFound("Appointment not found");
    }
    //check if user has access to this appointment
    const userRole = req.auth.type;
    if (
      userRole == "doctor" &&
      appointment.doctorId._id.toString() !== req.auth.id
    ) {
      return res.forbidden("Access denied");
    }
    if (
      userRole == "patient" &&
      appointment.patientId._id.toString() !== req.auth.id
    ) {
      return res.forbidden("Access denied");
    }
    res.ok({ appointment }, "Appointment fetch successfully");
  } catch (error) {
    res.serverError("Failed to get appointment", error.message);
  }
});

//join

router.get("/join/:id", authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name ")
      .populate("doctorId", "name");
    if (!appointment) {
      return res.notFound("Appointment not found");
    }
    appointment.status = "In progress";
    await appointment.save();
    res.ok(
      {
        roomId: appointment.zegoRoomId,
        appointment,
      },
      "Consultation join successfully"
    );
  } catch (error) {
    res.serverError("Failed to join Consultation", error.message);
  }
});

//end

router.put("/end/:id", authenticate, async (req, res) => {
  try {
    const { prescription, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "Completed",
        prescription,
        notes,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("patientId doctorId");

    if (!appointment) {
      return res.notFound("Appointment not found");
    }

    res.ok(
      {
        appointment,
      },
      "Consultation end successfully"
    );
  } catch (error) {
    res.serverError("Failed to end Consultation", error.message);
  }
});

//update appointment  statusby doctor

router.put(
  "/status/:id",
  authenticate,
  requireRole("doctor"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const appointment = await Appointment.findById(req.params.id).populate(
        "patientId doctorId"
      );

      if (!appointment) {
        return res.notFound("Appointment not found");
      }

      if (appointment.doctorId._id.toString() !== req.auth.id) {
        return res.forbidden("Access denied");
      }

      appointment.status = status;
      appointment.updatedAt = new Date();
      await appointment.save();

      res.ok(
        {
          appointment,
        },
        "appointment status updated successfully"
      );
    } catch (error) {
      res.serverError("Failed to updated appointment status ", error.message);
    }
  }
);

export default router;
