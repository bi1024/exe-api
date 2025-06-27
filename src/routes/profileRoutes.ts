import express from "express";
// import TutorSkillController from "@/controllers/tutor/skillController.js";
import { verifyToken } from "@/middlewares/authMiddleware.js";
import {
  getMyPayments,
  getMyProfile,
  getTutorProfile,
  updateMyProfile,
} from "@/controllers/profileController";
import upload from "@/lib/multer";

const profileRoutes = express.Router();
// const skillController = new TutorSkillController();

profileRoutes.get("/myProfile", verifyToken, getMyProfile);
profileRoutes.get("/myProfile/payments", verifyToken, getMyPayments);
profileRoutes.get("/:id", verifyToken, getTutorProfile);
profileRoutes.post(
  "/myProfile",
  verifyToken,
  upload.single("file"),
  updateMyProfile,
);

export default profileRoutes;
