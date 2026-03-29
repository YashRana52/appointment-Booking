import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../model/Admin.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("../.env") });

async function createAdmin() {
  try {
    // connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", mongoose.connection.name);

    // check existing admin
    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // create admin
    const admin = new Admin({
      name: "System Administrator",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
      permissions: {
        userManagement: true,
        doctorManagement: true,
        paymentManagement: true,
        analytics: true,
      },
    });

    await admin.save();

    console.log("Admin user created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
