import { getTutors } from "@/controllers/tutor/tutorController.js";
import express from "express";

const tutorRoutes = express.Router();

tutorRoutes.get("/", getTutors);

export default tutorRoutes;
