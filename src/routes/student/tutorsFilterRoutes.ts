import TutorsFilterController from '@/controllers/student/tutorsFilterController';
import express from 'express';

const tutorsFilterRoutes = express.Router();
const tutorsFilterController = new TutorsFilterController();

tutorsFilterRoutes.get('/', tutorsFilterController.handleFilterTutors);

export default tutorsFilterRoutes;