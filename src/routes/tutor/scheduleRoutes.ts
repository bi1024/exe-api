import express from "express";
import TutorScheduleController from "@/controllers/tutor/scheduleController.js";
import { verifyToken, verifyTutor } from "@/middlewares/authMiddleware.js";

const tutorScheduleRoutes = express.Router();
const tutorScheduleController = new TutorScheduleController();

tutorScheduleRoutes.get('/', verifyToken, verifyTutor, tutorScheduleController.handleGetScheduleForTutor);
tutorScheduleRoutes.post('/', verifyToken, verifyTutor, tutorScheduleController.handleInsertSingleSlotForTutor);
tutorScheduleRoutes.put('/:slotId', verifyToken, verifyTutor, tutorScheduleController.handleUpdateSingleSlot);
tutorScheduleRoutes.delete('/:slotId', verifyToken, verifyTutor, tutorScheduleController.handleDeleteSingleSlot);

export default tutorScheduleRoutes;