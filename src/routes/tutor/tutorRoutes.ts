import {
  deleteCert,
  getCerts,
  getTutorCerts,
  getTutorOwnHourlyRate,
  getTutors,
  updateHourlyRate,
  uploadCert,
} from "@/controllers/tutor/tutorController.js";
import upload from "@/lib/multer.js";

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

tutorRoutes.post(
  "/certs",
  verifyToken,
  verifyTutor,
  upload.single("file"),
  uploadCert,
);

tutorRoutes.get("/certs", verifyToken, verifyTutor, getCerts);

tutorRoutes.get("/certs/:tutorId", verifyToken, getTutorCerts);

tutorRoutes.delete("/certs/:id", verifyToken, verifyTutor, deleteCert);

export default tutorRoutes;
