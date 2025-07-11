import { TutorReviewController } from '@/controllers/student/tutorReviewController';
import { verifyStudent, verifyToken } from '@/middlewares/authMiddleware';
import express from 'express';

const tutorReviewRoutes = express.Router();
const tutorReviewController = new TutorReviewController();

tutorReviewRoutes.use(verifyToken, verifyStudent);

tutorReviewRoutes.get('/tutors/commentable', tutorReviewController.handleGetTutorsLearnedBefore);
tutorReviewRoutes.post('/', tutorReviewController.handleInsertTutorReview);
tutorReviewRoutes.put('/:reviewId', tutorReviewController.handleUpdateTutorReview)
tutorReviewRoutes.get('/tutors/reviews/:tutorId', tutorReviewController.handleGetReviewsOfTutor);

export default tutorReviewRoutes;