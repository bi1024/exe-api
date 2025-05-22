import express from "express";
import TutorScheduleController from "@/controllers/tutor/scheduleController.js";
import {
  verifyStudent,
  verifyToken,
  verifyTutor,
} from "@/middlewares/authMiddleware.js";

const tutorScheduleRoutes = express.Router();
const tutorScheduleController = new TutorScheduleController();

tutorScheduleRoutes.get(
  "/",
  verifyToken,
  verifyTutor,
  tutorScheduleController.handleGetScheduleForTutor,
);
tutorScheduleRoutes.post(
  "/",
  verifyToken,
  verifyTutor,
  tutorScheduleController.handleInsertSingleSlotForTutor,
);
tutorScheduleRoutes.put(
  "/:slotId",
  verifyToken,
  verifyTutor,
  tutorScheduleController.handleUpdateSingleSlot,
);
tutorScheduleRoutes.delete(
  "/:slotId",
  verifyToken,
  verifyTutor,
  tutorScheduleController.handleDeleteSingleSlot,
);

//student
tutorScheduleRoutes.get(
  "/schedule-today",
  verifyToken,
  verifyStudent,
  tutorScheduleController.handleGetScheduleToday,
);

export default tutorScheduleRoutes;
