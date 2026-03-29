import express from "express";
import { validate } from "../middleware/validate.js";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";
import bcrypt from "bcryptjs";
import {
  authenticate,
  requireAdmin,
  requirePermission,
  requireRole,
} from "../middleware/auth.js";
import Doctor from "../model/Doctor.js";
import Patient from "../model/Patient.js";
import Appointment from "../model/Appointment.js";

const router = express.Router();

const signToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//admin login
router.post(
  "/auth/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  async (req, res) => {
    try {
      // find admin
      const admin = await Admin.findOne({ email: req.body.email });

      // check admin exists
      if (!admin || !admin.isActive) {
        return res.forbidden("Invalid credentials or inactive account");
      }

      // compare password
      const validatePassword = await bcrypt.compare(
        req.body.password,
        admin.password,
      );

      if (!validatePassword) {
        return res.unauthorized("Invalid credentials");
      }

      // update last login
      admin.lastLogin = new Date();
      await admin.save();

      // generate token
      const token = signToken(admin._id, "admin");

      res.ok(
        {
          token,
          user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            type: "admin",
          },
        },
        "Admin login successfully",
      );
    } catch (error) {
      res.serverError("Login failed", [error.message]);
    }
  },
);

//get admin profile

router.get("/profile", authenticate, requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select("-password");

    res.ok(admin, "Admin profile fetched successfully");
  } catch (error) {
    res.serverError("Profile fetch failed", [error.message]);
  }
});

//admin dashboard stats
router.get("/dashboard", authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalRevenue,
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "Completed" }),
      Appointment.countDocuments({ status: "Scheduled" }),

      // Total Revenue
      Appointment.aggregate([
        {
          $match: { status: "Completed" },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]).then((result) => (result[0] ? result[0].totalRevenue : 0)),
    ]);

    // Monthly Revenue (Last 6 months)
    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          status: "Completed",
          date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // User Growth + Appointment Stats
    const [userGrowth, appointmentStats, statusStats] = await Promise.all([
      // Patient Growth
      Patient.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            totalUsers: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),

      // Completed Appointment Stats
      Appointment.aggregate([
        {
          $match: {
            status: "Completed",
            date: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              year: { $year: "$date" },
            },
            patients: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),

      // Appointment Status Distribution
      Appointment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.ok(
      {
        totalPatients,
        totalDoctors,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalRevenue,
        monthlyRevenue,
        userGrowth,
        appointmentStats,
        statusStats,
      },
      "Dashboard stats fetched successfully",
    );
  } catch (error) {
    res.serverError("Dashboard stats fetch failed", [error.message]);
  }
});

//get all users (patients and doctors)
router.get(
  "/users",
  authenticate,
  requireAdmin,
  requirePermission("userManagement"),
  async (req, res) => {
    try {
      let { page = 1, limit = 10, type, search } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;

      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      let patients = [];
      let doctors = [];
      let totalPatients = 0;
      let totalDoctors = 0;

      if (type === "patient" || !type) {
        [patients, totalPatients] = await Promise.all([
          Patient.find(query).skip(skip).limit(limit),
          Patient.countDocuments(query),
        ]);
      }

      if (type === "doctor" || !type) {
        [doctors, totalDoctors] = await Promise.all([
          Doctor.find(query).skip(skip).limit(limit),
          Doctor.countDocuments(query),
        ]);
      }

      const users = [
        ...patients.map((p) => ({
          id: p._id,
          name: p.name,
          email: p.email,
          type: "patient",
          isActive: p.isActive,
          isVerified: p.isVerified,
          createdAt: p.createdAt,
        })),
        ...doctors.map((d) => ({
          id: d._id,
          name: d.name,
          email: d.email,
          type: "doctor",
          isActive: d.isActive,
          isVerified: d.isVerified,
          createdAt: d.createdAt,
        })),
      ];

      const total = totalPatients + totalDoctors;

      res.ok(
        {
          users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        "Users fetched successfully",
      );
    } catch (error) {
      res.serverError("Users fetch failed", [error.message]);
    }
  },
);

//update user status (activate/deactivate)
router.put(
  "/users/:userId/status",
  authenticate,
  requireAdmin,
  requirePermission("userManagement"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.badRequest("isActive must be boolean");
      }

      // check both collections
      const [patient, doctor] = await Promise.all([
        Patient.findById(userId),
        Doctor.findById(userId),
      ]);

      if (!patient && !doctor) {
        return res.notFound("User not found");
      }

      let updatedUser;

      if (patient) {
        updatedUser = await Patient.findByIdAndUpdate(
          userId,
          { isActive },
          { new: true },
        ).select("-password");
      } else {
        updatedUser = await Doctor.findByIdAndUpdate(
          userId,
          { isActive },
          { new: true },
        ).select("-password");
      }

      return res.ok(updatedUser, "User status updated successfully");
    } catch (error) {
      console.error(error);
      res.serverError("User status update failed", [error.message]);
    }
  },
);

// payment get for payout for doctor
router.get(
  "/payment",
  authenticate,
  requireAdmin,
  requirePermission("paymentManagement"),
  async (req, res) => {
    try {
      let { page = 1, limit = 10, payoutStatus } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;

      let matchedQuery = { status: "Completed" };

      if (payoutStatus) {
        matchedQuery.payoutStatus = payoutStatus;
      }

      const paymentsData = await Appointment.aggregate([
        {
          $match: matchedQuery,
        },

        // doctor join
        {
          $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
          },
        },
        {
          $unwind: "$doctor",
        },

        // patient join
        {
          $lookup: {
            from: "patients",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $unwind: "$patient",
        },

        {
          $project: {
            _id: 1,
            date: 1,

            doctorName: "$doctor.name",
            doctorEmail: "$doctor.email",

            patientName: "$patient.name",
            patientEmail: "$patient.email",

            consultationFees: 1,
            platformFees: 1,
            totalAmount: 1,

            paymentStatus: 1,
            payoutStatus: 1,
            payoutDate: 1,

            createdAt: 1,
          },
        },

        {
          $sort: { createdAt: -1 },
        },

        {
          $facet: {
            payments: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const payments = paymentsData[0].payments;
      const total = paymentsData[0].totalCount[0]?.count || 0;

      res.ok(
        {
          payments,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        "Payments fetched successfully",
      );
    } catch (error) {
      console.error(error);
      res.serverError("Payments fetch failed", [error.message]);
    }
  },
);

//Process payout for doctor
router.put(
  "/payment/:appointmentId/payout",
  authenticate,
  requireAdmin,
  requirePermission("paymentManagement"),
  async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { payoutStatus } = req.body;

      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.notFound("Appointment not found");
      }

      // payout sirf completed appointment pe hoga
      if (appointment.status !== "Completed") {
        return res.badRequest(
          "Only completed appointments can be processed for payout",
        );
      }

      const payoutAmount = appointment.consultationFees;
      const platformFees = appointment.platformFees;

      const updateData = {
        payoutStatus,
      };

      // agar payout paid ho gaya
      if (payoutStatus === "Paid") {
        updateData.payoutDate = new Date();
      }

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true },
      )
        .populate("doctorId", "name email")
        .populate("patientId", "name email");

      const message =
        payoutStatus === "Paid"
          ? `Payout marked as paid. Doctor received ₹${payoutAmount}, And Platform Keeps ₹${platformFees}`
          : "Payout status updated successfully";

      res.ok(
        {
          ...updatedAppointment.toObject(),
          payoutAmount,
          platformFees,
        },
        message,
      );
    } catch (error) {
      console.error(error);
      res.serverError("Payout status update failed", [error.message]);
    }
  },
);

export default router;
