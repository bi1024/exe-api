import PaymentTransaction from "@/models/payment/PaymentTransaction";
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
    const result = await VisitCountsModel.find().sort("date");
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getTotalProfit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [result] = await PaymentTransaction.aggregate([
      {
        $match: { status: "success" }, // Filter only successful payments
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }, // Sum the `amount` field
        },
      },
    ]);
    const profit = result.totalAmount / 10;
    res.status(StatusCodes.OK).json(profit);
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
      { $sort: { _id: 1 } }, // sort by date ascending
      {
        $setWindowFields: {
          partitionBy: null,
          sortBy: { _id: 1 },
          output: {
            cumulativeCount: {
              $sum: "$dailyCount",
              window: {
                documents: ["unbounded", "current"],
              },
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

export const getDailyAggregateRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PaymentTransaction.aggregate([
      {
        $match: {
          status: "success", // Filter only successful payments
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dailyRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
      {
        $setWindowFields: {
          partitionBy: null,
          sortBy: { _id: 1 },
          output: {
            cumulativeRevenue: {
              $sum: "$dailyRevenue",
              window: {
                documents: ["unbounded", "current"],
              },
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