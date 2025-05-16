import express from "express";
// import itemRoutes from './routes/itemRoutes';

import { errorHandler } from "./middlewares/errorHandler.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// Routes
// app.use('/api/items', itemRoutes);
app.use("/api/auth", authRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
