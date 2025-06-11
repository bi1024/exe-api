import express from "express";
// import itemRoutes from './routes/itemRoutes';

import { errorHandler } from "./middlewares/errorHandler.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "@/routes/tutor/skillRoutes.js";
import tutorScheduleRoutes from "@/routes/tutor/scheduleRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import studentBookingRoutes from "./routes/student/bookingRoutes.js";
import tutorRoutes from "./routes/tutor/tutorRoutes.js";
import dotenv from "dotenv";
import profileRoutes from "./routes/profileRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_END_URL || "http://localhost:5173",
    // origin: "*",
    credentials: true,
  }),
);
// Routes
// app.use('/api/items', itemRoutes);

app.get("/api", (req, res) => {
  res.json("Welcome!");
});

app.use("/api/auth", authRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/tutor/skills", skillRoutes);
app.use("/api/tutor/schedules", tutorScheduleRoutes);
app.use("/api/student/booking", studentBookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/profile", profileRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
