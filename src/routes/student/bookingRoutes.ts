import StudentBookingController from '@/controllers/student/bookingController.js';
import express from 'express';

const studentBookingRoutes = express.Router();
const studentBookingController = new StudentBookingController();

studentBookingRoutes.get('/', studentBookingController.handleGetSlotsAvailableOfTutor);

export default studentBookingRoutes;

