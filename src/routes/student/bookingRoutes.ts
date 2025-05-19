import StudentBookingController from '@/controllers/student/bookingController.js';
import { verifyStudent, verifyToken } from '@/middlewares/authMiddleware.js';
import express from 'express';

const studentBookingRoutes = express.Router();
const studentBookingController = new StudentBookingController();

studentBookingRoutes.get('/', verifyToken, verifyStudent, studentBookingController.handleGetSlotsAvailableOfTutor);

export default studentBookingRoutes;

