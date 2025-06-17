import User from "@/models/User";
import VisitCountsModel from "@/models/VisitCount";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const logVisit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    await VisitCountsModel.findOneAndUpdate(
      { date: startOfDay },
      { $inc: { count: 1 } },
      { upsert: true, new: true },
    );
  } catch (err) {
    next(err);
    return;
  }

  res.status(StatusCodes.OK);
};

export const getDailyVisitCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await VisitCountsModel.find();
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getDailyAggregateUserCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dailyCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: {
            cumulativeCount: {
              $sum: "$dailyCount",
              window: { documents: ["unbounded", "current"] },
            },
          },
        },
      },
    ]);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
