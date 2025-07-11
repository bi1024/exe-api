import { NextFunction, Request, Response } from "express";
import TutorScheduleModel, {
  ISlotAdded,
  ISlotUpdated,
  ITutorSchedule,
} from "@/models/TutorSchedule.js";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import SkillsModel from "@/models/Skill.js";
import BadRequest from "@/errors/BadRequest.js";
import { getCurrentMonth, getCurrentWeek, getNextMonths, getNextWeeks } from "@/utils/dateUtils";
import { addMonths, addWeeks, endOfDay, startOfDay } from "date-fns";

export default class TutorScheduleController {
  public async handleGetScheduleForTutor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user!.userId;

    let tutorSchedule;
    try {
      tutorSchedule = await TutorScheduleModel.find({ tutor: userId })
        .populate("skill")
        .lean();
    } catch (err) {
      next(err);
      return;
    }

    res.status(StatusCodes.OK).json(tutorSchedule);
  }

  public async handleInsertSingleSlotForTutor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user!.userId;

    const { startTime, endTime, skill } = req.body as ISlotAdded;
    let skillId: Types.ObjectId | null = null;

    try {
      if (skill) {
        skillId = await SkillsModel.findOne({ name: skill as string });
        if (!skillId) {
          next(new BadRequest("Invalid skill, cannot CREATE new slot"));
          return;
        }
      }
    } catch (err) {
      next(err);
      return;
    }

    const slotAddedValue = {
      tutor: userId,
      startTime,
      endTime,
      skill: skillId,
    };
    let tutorSlot;
    try {
      tutorSlot = await TutorScheduleModel.create(slotAddedValue);
    } catch (err) {
      next(err);
      return;
    }
    res.status(StatusCodes.OK).json(tutorSlot);
  }

  public async handleUpdateSingleSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { slotId } = req.params as { slotId: string };
    const { startTime, endTime, skill } = req.body as ISlotUpdated;
    let skillId: Types.ObjectId | null = null;

    try {
      if (skill) {
        skillId = await SkillsModel.findOne({ name: skill as string });
        if (!skillId) {
          next(new BadRequest("Invalid skill, cannot CREATE new slot"));
          return;
        }
      }
    } catch (err) {
      next(err);
      return;
    }

    const slotUpdatedValue = { startTime, endTime, skill: skillId };
    let tutorSlot;
    try {
      tutorSlot = await TutorScheduleModel.findByIdAndUpdate(
        slotId,
        slotUpdatedValue,
        { new: true },
      ).populate("skill");
    } catch (err) {
      next(err);
      return;
    }
    res.status(StatusCodes.OK).json(tutorSlot);
  }

  public async handleDeleteSingleSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { slotId } = req.params as { slotId: string };
    try {
      await TutorScheduleModel.findByIdAndDelete(slotId);
    } catch (err) {
      next(err);
      return;
    }
    res.status(StatusCodes.NO_CONTENT).json();
  }
  public async handleGetScheduleToday(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user.userId;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const result = await TutorScheduleModel.find({
        student: userId,
        startTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .populate("skill")
        .populate("tutor")
        .populate("student");

      console.log(result);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
      return;
    }
  }

  public async handleGetScheduleTodayTutor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user.userId;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const result = await TutorScheduleModel.find({
        tutor: userId,
        startTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        isBooked: true,
      })
        .populate("skill")
        .populate("tutor")
        .populate("student");

      console.log(result);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
      return;
    }
  }

  public async handleCopyWeeksSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user!.userId;
    const { numberOfWeeks } = req.body as { numberOfWeeks: number };
    const { start, end } = getCurrentWeek();
    let currentWeekSchedule: ITutorSchedule[];
    try {
      currentWeekSchedule = await TutorScheduleModel.find({
        tutor: userId,
        startTime: { $gte: startOfDay(start), $lte: endOfDay(end) },
        endTime: { $gte: startOfDay(start), $lte: endOfDay(end) },
      })
        .populate("skill")
        .lean();
    } catch (err) {
      next(err);
      return;
    }

    // todo: delete all slots of next weeks before inserting new ones

    const { start: nextWeekStart, end: lastWeekEnd } =
      getNextWeeks(numberOfWeeks);
    // console.log(nextWeekStart + ", " + lastWeekEnd);
    await TutorScheduleModel.deleteMany({
      tutor: userId,
      startTime: {
        $gte: startOfDay(nextWeekStart),
        $lte: endOfDay(lastWeekEnd),
      },
      endTime: { $gte: startOfDay(nextWeekStart), $lte: endOfDay(lastWeekEnd) },
    });

    for (const slot of currentWeekSchedule) {
      const { startTime, endTime, skill } = slot;
      for (let i = 1; i <= numberOfWeeks; ++i) {
        const nextStartTime = addWeeks(startTime, i);
        const nextEndTime = addWeeks(endTime, i);
        const slotAdded: ISlotAdded = {
          tutor: userId,
          startTime: nextStartTime,
          endTime: nextEndTime,
          skill,
        };
        await TutorScheduleModel.create(slotAdded);
      }
    }

    res.status(StatusCodes.CREATED).json({ success: true });
  }

  public async handleCopyMonthsSchedule(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user!.userId;
    const { numberOfMonths } = req.body as { numberOfMonths: number };
    const { start, end } = getCurrentMonth();

    let currentMonthSchedule: ITutorSchedule[];
    try {
      currentMonthSchedule = await TutorScheduleModel.find({
        tutor: userId,
        startTime: { $gte: startOfDay(start), $lte: endOfDay(end) },
        endTime: { $gte: startOfDay(start), $lte: endOfDay(end) },
      })
        .populate("skill")
        .lean();
    } catch (err) {
      next(err);
      return;
    }

    console.log(currentMonthSchedule.length);
    const { start: nextMonthStart, end: lastMonthEnd } =
      getNextMonths(numberOfMonths);

    await TutorScheduleModel.deleteMany({
      tutor: userId,
      startTime: {
        $gte: startOfDay(nextMonthStart),
        $lte: endOfDay(lastMonthEnd),
      },
      endTime: { $gte: startOfDay(nextMonthStart), $lte: endOfDay(lastMonthEnd) },
    });

    for (const slot of currentMonthSchedule) {
      const { startTime, endTime, skill } = slot;
      for (let i = 1; i <= numberOfMonths; ++i) {
        const nextStartTime = addMonths(startTime, i);
        const nextEndTime = addMonths(endTime, i);
        const slotAdded: ISlotAdded = {
          tutor: userId,
          startTime: nextStartTime,
          endTime: nextEndTime,
          skill,
        };
        await TutorScheduleModel.create(slotAdded);
      }
    }

    res.status(StatusCodes.CREATED).json({ success: true });
  }
}
