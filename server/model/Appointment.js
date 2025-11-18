import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    date: { type: Date, required: true },
    slotStartIso: { type: String, required: true },
    slotEndIso: { type: String, required: true },

    consultationType: {
      type: String,
      enum: ["Video Consultation", "Voice Call"],
      default: "Video Consultation",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "In Progress"],
      default: "Scheduled",
    },

    symptoms: { type: String, default: "" },
    zegoRoomId: { type: String, default: "" },
    prescription: { type: String, default: "" },
    notes: { type: String, default: "" },

    consultationFees: { type: Number, required: true },
    platformFees: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Refunded", "Paid"],
      default: "Pending",
    },

    payoutStatus: {
      type: String,
      enum: ["Pending", "Cancelled", "Paid"],
      default: "Pending",
    },

    payoutDate: Date,
    paymentMethod: { type: String, default: "Online" },

    durationMinutes: { type: Number, default: 30 },

    //razorpay payment fields

    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentDate: { type: Date },
  },

  { timestamps: true }
);

// Prevent duplicate slot bookings
appointmentSchema.index(
  { doctorId: 1, date: 1, slotStartIso: 1 },
  { unique: true }
);

export default mongoose.model("Appointment", appointmentSchema);
