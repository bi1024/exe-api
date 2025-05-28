import {
  getTutorOwnHourlyRate,
  getTutors,
  updateHourlyRate,
} from "@/controllers/tutor/tutorController.js";
import { verifyToken, verifyTutor } from "@/middlewares/authMiddleware.js";
import express from "express";

const tutorRoutes = express.Router();

tutorRoutes.get("/", getTutors);
tutorRoutes.get(
  "/hourly-rate",
  verifyToken,
  verifyTutor,
  getTutorOwnHourlyRate,
);

tutorRoutes.post("/hourly-rate", verifyToken, verifyTutor, updateHourlyRate);

export default tutorRoutes;
