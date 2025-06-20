import express from "express";
// import TutorSkillController from "@/controllers/tutor/skillController.js";

import {
  getDailyAggregateUserCount,
  getDailyVisitCount,
  logVisit,
} from "@/controllers/utilityController";

const utilityRoutes = express.Router();
// const skillController = new TutorSkillController();

utilityRoutes.get("/log-visit", logVisit);
utilityRoutes.get("/daily-visit-count", getDailyVisitCount);
utilityRoutes.get("/user-count", getDailyAggregateUserCount);

export default utilityRoutes;
