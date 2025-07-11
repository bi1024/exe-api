import express from "express";
import { testChatbot } from "@/controllers/chatbotController.js";

const router = express.Router();

router.post("/general", testChatbot);

export default router;
