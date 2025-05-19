import express from "express";
import TutorScheduleController from "../controllers/tutorScheduleController.js";

const tutorScheduleRoutes = express.Router();
const tutorScheduleController = new TutorScheduleController();

tutorScheduleRoutes.get('/', tutorScheduleController.handleGetScheduleForTutor);
tutorScheduleRoutes.post('/', tutorScheduleController.handleInsertSingleSlotForTutor);
tutorScheduleRoutes.put('/:slotId', tutorScheduleController.handleUpdateSingleSlot);
tutorScheduleRoutes.delete('/:slotId', tutorScheduleController.handleDeleteSingleSlot);

export default tutorScheduleRoutes;