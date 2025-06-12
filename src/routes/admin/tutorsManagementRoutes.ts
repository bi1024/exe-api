import TutorsManagementController from '@/controllers/admin/tutorsManagementController';
import express from 'express';

const tutorsManagementRoutes = express.Router();
const tutorsManagementController = new TutorsManagementController();

tutorsManagementRoutes.get('/pending', tutorsManagementController.handleGetTutorsPending);
tutorsManagementRoutes.put('/approving', tutorsManagementController.handleApproveTutorPending);

export default tutorsManagementRoutes;