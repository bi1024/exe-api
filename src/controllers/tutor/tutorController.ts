import { uploadImage } from "@/lib/cloudinary.js";
import CertsModel, { ICert } from "@/models/Cert.js";
import { TutorReviewModel } from "@/models/TutorReview";
import User from "@/models/User.js";
import { Request, Response } from "express";

export const getTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await User.find({
      role: "tutor",
      status: { $ne: "pending" },
    })
      .select("-password")
      .populate("skills"); // omit password from response

    const tutorsResponsed = [];
    for(const tutor of tutors) {
        const result = await TutorReviewModel.aggregate([
            {
                $match: {
                    tutor: tutor._id
                }
            },
            {
                $group: {
                    _id: null,
                    ratingAverage: { $avg: '$rating' }
                }
            },
            {
                $project: {
                    _id: 0,
                    ratingAverage: 1
                }
            }
        ])  
        const ratingAverage = result.length ? result[0].ratingAverage : 0;
        tutorsResponsed.push({ ...tutor.toObject(), ratingAverage });
    }
    res.status(200).json({ success: true, data: tutorsResponsed });
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

export const getCerts = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  try {
    const certs = await CertsModel.find({ tutor: userId }).populate("skill");
    res.status(200).json({ success: true, data: certs });
  } catch (error) {
    console.error("Failed to fetch certs:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve tcerts." });
  }
};

export const getTutorCerts = async (req: Request, res: Response) => {
  const certId = req.params.tutorId;
  // const userId = req.user!.userId;
  try {
    const certs = await CertsModel.find({ tutor: certId }).populate("skill");
    console.log(certs);
    res.status(200).json({ success: true, data: certs });
  } catch (error) {
    console.error("Failed to fetch certs:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve tcerts." });
  }
};

export const deleteCert = async (req: Request, res: Response) => {
  const certId = req.params.id;
  try {
    const cert = await CertsModel.findByIdAndDelete(certId);
    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    console.error("Failed to delete cert:", error);
    res.status(500).json({ success: false, message: "Failed to delete cert." });
  }
};

export const uploadCert = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  if (req.file && userId) {
    try {
      const imageUrl = await uploadImage(req.file.buffer);
      const newCert = {
        tutor: userId,
        name: req.body.certName,
        description: req.body.certDesc,
        skill: req.body.skillId,
        imageUrl: imageUrl,
      } as ICert;
      const result = await CertsModel.create(newCert);
      // const { startTime, endTime, skill } = req.body as ICert;
      // console.log("URL", imageUrl);
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
};
