import { NextFunction, Request, Response } from "express";
import User, { IUser } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { uploadImage } from "@/lib/cloudinary";
import PaymentTransaction from "@/models/payment/PaymentTransaction";

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.userId;
  // const myProfile = await User.findById(userId);

  let myProfile;
  try {
    myProfile = await User.findById(userId);
  } catch (err) {
    next(err);
    return;
  }

  res.status(StatusCodes.OK).json(myProfile);
};

export const getMyPayments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("payments");
  const userId = req.user!.userId;
  // const myProfile = await User.findById(userId);

  let myPayments;
  try {
    // myProfile = await User.findById(userId);
    console.log(userId);
    myPayments = await PaymentTransaction.find({ userId: userId });
  } catch (err) {
    next(err);
    return;
  }

  res.status(StatusCodes.OK).json(myPayments);
};

export const getTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const userId = req.user!.userId;
  const userId = req.params.id;
  // const myProfile = await User.findById(userId);

  let tutorProfile;
  try {
    tutorProfile = await User.findById(userId);
  } catch (err) {
    next(err);
    return;
  }

  res.status(StatusCodes.OK).json(tutorProfile);
};
export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.userId;
  if (userId) {
    const updateObject: Partial<IUser> = {};

    try {
      if (req.file) {
        // Conditionally attach image
        const imageUrl = await uploadImage(req.file.buffer);
        console.log(imageUrl);
        updateObject.avatarUrl = imageUrl;
      }

      const newUser = await User.findByIdAndUpdate(
        userId,
        {
          ...updateObject,
          fullname: req.body.fullname,
          bio: req.body.bio,
        },
        {
          new: true, //returns updated document
        },
      );

      res.status(200).json(newUser);
    } catch (err) {
      console.log(err);

      res.status(500).json({ error: "Upload failed" });
    }
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};
