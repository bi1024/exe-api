import { NextFunction, Request, Response } from "express";
import User, { IUser } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { uploadImage } from "@/lib/cloudinary";

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

export const getTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const userId = req.user!.userId;
  const userId = req.params.id;
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
