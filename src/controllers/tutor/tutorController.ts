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
