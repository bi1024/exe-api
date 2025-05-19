import express from "express";
import TutorScheduleController from "@/controllers/tutor/scheduleController.js";
import { verifyToken } from "@/middlewares/verifyToken.js";

const tutorScheduleRoutes = express.Router();
const tutorScheduleController = new TutorScheduleController();

tutorScheduleRoutes.get('/', verifyToken ,tutorScheduleController.handleGetScheduleForTutor);
tutorScheduleRoutes.post('/', verifyToken, tutorScheduleController.handleInsertSingleSlotForTutor);
tutorScheduleRoutes.put('/:slotId', verifyToken, tutorScheduleController.handleUpdateSingleSlot);
tutorScheduleRoutes.delete('/:slotId', verifyToken, tutorScheduleController.handleDeleteSingleSlot);

export default tutorScheduleRoutes;