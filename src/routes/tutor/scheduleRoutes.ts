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

tutorScheduleRoutes.get(
  "/tutor-schedule-today",
  tutorScheduleController.handleGetScheduleTodayTutor,
);

//student
tutorScheduleRoutes.get(
  "/schedule-today",
  tutorScheduleController.handleGetScheduleToday,
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

tutorScheduleRoutes.post('/copy-current-week', tutorScheduleController.handleCopyWeeksSchedule);
tutorScheduleRoutes.post('/copy-current-month', tutorScheduleController.handleCopyMonthsSchedule);

export default tutorScheduleRoutes;
