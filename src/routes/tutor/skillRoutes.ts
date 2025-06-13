import express from "express";
import TutorSkillController from "@/controllers/tutor/skillController.js";
import { verifyToken, verifyTutor, verifyTutorApproved } from "@/middlewares/authMiddleware.js";

const skillRoutes = express.Router();
const skillController = new TutorSkillController();

skillRoutes.use(verifyToken, verifyTutor, verifyTutorApproved);

skillRoutes.get('/:skillId', verifyToken, skillController.handleGetSingleSkill);
skillRoutes.get('/', verifyToken, skillController.handleGetSkillsForTeacher);
skillRoutes.post('/', verifyToken, skillController.handleInsertSingleSkillForTeacher);
skillRoutes.put('/:skillId', verifyToken, skillController.handleUpdateSingleSkill);
skillRoutes.delete('/:skillId', verifyToken, skillController.handleDeleteSingleSkill);

export default skillRoutes;