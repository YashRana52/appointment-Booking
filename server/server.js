import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import passport from "passport";

// Middlewares
import response from "./middleware/response.js";

// Routes
import authRoutes from "./routes/auth.js";
import doctorRouter from "./routes/doctor.js";
import patientRouter from "./routes/patient.js";
import appointmentRouter from "./routes/appointment.js";
import paymentRouter from "./routes/payment.js";

const app = express();

app.use(helmet());

app.use(morgan("dev"));

// CORS setup
app.use(
  cors({
    origin: "https://appointment-booking-plum.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom Response Middleware
app.use(response);

//initialise passport

app.use(passport.initialize());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("Mongodb error", err));
console.log("Connected to DB:", mongoose.connection.name);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/payment", paymentRouter);

// Health Check
app.get("/health", (req, res) => {
  res.ok({ time: new Date().toISOString() }, "Server is healthy");
});
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is listen on port:${PORT}`));
