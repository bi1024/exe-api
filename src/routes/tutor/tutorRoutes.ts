import {
  deleteCert,
  getCerts,
  getTutorCerts,
  getTutorOwnHourlyRate,
  getTutors,
  updateHourlyRate,
  uploadCert,
} from "@/controllers/tutor/tutorController.js";
import videoUpload from "@/lib/videoMulter";
import upload from "@/lib/multer.js";

import { verifyToken, verifyTutor } from "@/middlewares/authMiddleware.js";
import express from "express";
import { uploadVideo } from "@/lib/cloudinary";
import User from "@/models/User";

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

tutorRoutes.post(
  "/video",
  verifyToken,
  verifyTutor,
  videoUpload.single("video"),
  async (req, res) => {
    const tutorId = req.user.userId;
    try {
      const result: any = await uploadVideo(req.file.buffer);
      const tutor = await User.findById(tutorId).select("-password"); // omit password from response
      if (!tutor) {
        throw new Error();
      }
      tutor.videoUrl = result.secure_url;
      const updatedResult = await tutor.save();
      await tutor.save();
      res.json({ videoUrl: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: "Video upload failed." });
    }
  },
);

tutorRoutes.get("/certs", verifyToken, verifyTutor, getCerts);

tutorRoutes.get("/certs/:tutorId", verifyToken, getTutorCerts);

tutorRoutes.delete("/certs/:id", verifyToken, verifyTutor, deleteCert);

export default tutorRoutes;
