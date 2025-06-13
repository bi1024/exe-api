import express from "express";
// import TutorSkillController from "@/controllers/tutor/skillController.js";
import { verifyToken } from "@/middlewares/authMiddleware.js";
import { getMyProfile, updateMyProfile } from "@/controllers/profileController";
import upload from "@/lib/multer";

const profileRoutes = express.Router();
// const skillController = new TutorSkillController();

profileRoutes.get("/myProfile", verifyToken, getMyProfile);
profileRoutes.post(
  "/myProfile",
  verifyToken,
  upload.single("file"),
  updateMyProfile,
);

export default profileRoutes;
