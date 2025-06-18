import { NextFunction, Request, Response } from "express";
import TutorScheduleModel, {
  ISlotAdded,
  ISlotUpdated,
} from "@/models/TutorSchedule.js";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import SkillsModel from "@/models/Skill.js";
import BadRequest from "@/errors/BadRequest.js";

export default class TutorScheduleController {
  public async handleGetScheduleForTutor(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.user!.userId;

    let tutorSchedule;
    try {
      tutorSchedule = await TutorScheduleModel
        .find({ tutor: userId })
        .populate(
          "skill",
        )
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
}
