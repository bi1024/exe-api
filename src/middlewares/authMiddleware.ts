import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret"; // Make sure this is set in .env

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Attach decoded user info (like userId) to the request
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired token." });
    }
  }
};

export function verifyStudent(req: Request, res: Response, next: NextFunction) {
  if(req.user!.role !== 'user') {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied. Must be Student' });
  } else {
    next();
  }
}

export function verifyTutor(req: Request, res: Response, next: NextFunction) {
  if(req.user!.role !== 'tutor') {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied. Must be Tutor' });
  } else {
    next();
  }
}

export function verifyTutorApproved(req: Request, res: Response, next: NextFunction) {
  if(req.user!.status !== 'approved') {
    res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied. Tutor must be approved' });
  } else {
    next();
  }
}