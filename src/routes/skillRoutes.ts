import express from "express";
import SkillController from "../controllers/skillController.js";

const skillRoutes = express.Router();
const skillController = new SkillController();

skillRoutes.get('/:skillId', skillController.handleGetSingleSkill);
skillRoutes.get('/', skillController.handleGetSkillsForTeacher);
skillRoutes.post('/', skillController.handleInsertSingleSkillForTeacher);
skillRoutes.put('/:skillId', skillController.handleUpdateSingleSkill);
skillRoutes.delete('/:skillId', skillController.handleDeleteSingleSkill);

export default skillRoutes;