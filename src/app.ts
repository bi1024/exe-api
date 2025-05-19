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

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// Routes
// app.use('/api/items', itemRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/tutor-schedules', tutorScheduleRoutes);
app.use("/api/payment", paymentRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
