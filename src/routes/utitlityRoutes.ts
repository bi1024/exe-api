import express from "express";
// import TutorSkillController from "@/controllers/tutor/skillController.js";

import {
  getDailyAggregateRevenue,
  getDailyAggregateUserCount,
  getDailyVisitCount,
  getTotalProfit,
  logVisit,
} from "@/controllers/utilityController";

const utilityRoutes = express.Router();
// const skillController = new TutorSkillController();

utilityRoutes.get("/log-visit", logVisit);
utilityRoutes.get("/daily-visit-count", getDailyVisitCount);
utilityRoutes.get("/user-count", getDailyAggregateUserCount);
utilityRoutes.get("/profit-count", getTotalProfit);
utilityRoutes.get("/revenue-count", getDailyAggregateRevenue);

export default utilityRoutes;
