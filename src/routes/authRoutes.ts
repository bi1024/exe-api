import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/test", verifyToken, (req, res) => {
  res.json({ ok: "ok" });
});

export default router;
