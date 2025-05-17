import express from "express";
import SkillController from "../controllers/skillController.js";

const skillRoutes = express.Router();
const skillController = new SkillController();

skillRoutes.get('/', skillController.handleGetSkillsForTeacher);
skillRoutes.post('/', skillController.handleInsertSingleSkillForTeacher);

export default skillRoutes;