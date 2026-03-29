import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "super_admin"],
      default: "admin",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    permissions: {
      userManagement: {
        type: Boolean,
        default: true,
      },
      doctorManagement: { type: Boolean, default: true },
      paymentManagement: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
