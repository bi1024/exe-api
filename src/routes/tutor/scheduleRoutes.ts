import express from "express";
import TutorScheduleController from "@/controllers/tutor/scheduleController.js";
import {
  verifyToken,
  verifyTutor,
  verifyTutorApproved,
} from "@/middlewares/authMiddleware.js";

const tutorScheduleRoutes = express.Router();
const tutorScheduleController = new TutorScheduleController();

tutorScheduleRoutes.use(verifyToken, verifyTutor, verifyTutorApproved);

tutorScheduleRoutes.get(
  "/",
  tutorScheduleController.handleGetScheduleForTutor,
);
tutorScheduleRoutes.post(
  "/",
  tutorScheduleController.handleInsertSingleSlotForTutor,
);
tutorScheduleRoutes.put(
  "/:slotId",
  tutorScheduleController.handleUpdateSingleSlot,
);
tutorScheduleRoutes.delete(
  "/:slotId",
  tutorScheduleController.handleDeleteSingleSlot,
);

tutorScheduleRoutes.get(
  "/tutor-schedule-today",
  tutorScheduleController.handleGetScheduleTodayTutor,
);

//student
tutorScheduleRoutes.get(
  "/schedule-today",
  tutorScheduleController.handleGetScheduleToday,
);

export default tutorScheduleRoutes;
