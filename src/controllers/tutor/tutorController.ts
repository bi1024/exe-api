import User from "@/models/User.js";
import { Request, Response } from "express";

export const getTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await User.find({ role: "tutor" })
      .select("-password")
      .populate("skills"); // omit password from response
    res.status(200).json({ success: true, data: tutors });
  } catch (error) {
    console.error("Failed to fetch tutors:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve tutors." });
  }
};

export const getTutorOwnHourlyRate = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user.userId;

    const tutor = await User.findById(tutorId).select("-password"); // omit password from response
    res.status(200).json({ success: true, data: tutor });
  } catch (error) {
    console.error("Failed to fetch tutors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tutor information.",
    });
  }
};

export const updateHourlyRate = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user.userId;
    const newHourlyRate = req.body.hourlyRate;

    const tutor = await User.findById(tutorId).select("-password"); // omit password from response
    if (!tutor) {
      throw new Error();
    }
    tutor.hourlyRate = newHourlyRate;
    const result = await tutor.save();

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Failed to fetch tutors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tutor information.",
    });
  }
};
