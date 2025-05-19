import { NextFunction, Request, Response } from "express";
import TutorScheduleModel, { ISlotAdded, ISlotUpdated } from "../models/TutorSchedule.js";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import SkillsModel from "../models/Skill.js";
import BadReuest from "../errors/BadRequest.js";

export default class TutorScheduleController {
    public async handleGetScheduleForTutor(req: Request, res: Response, next: NextFunction) {
        const userId = '68283fe3afce1a3e4278028a'; // todo
        
        let tutorSchedule;
        try {
            tutorSchedule = await TutorScheduleModel.find({ tutor: userId }).populate('skill');
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json(tutorSchedule);
    }

    public async handleInsertSingleSlotForTutor(req: Request, res: Response, next: NextFunction) {
        const userId = '68283fe3afce1a3e4278028a'; // todo

        const { startTime, endTime, skill } = req.body as ISlotAdded;
        let skillId : Types.ObjectId | null = null;

        try {
            if(skill) {
                skillId = await SkillsModel.findOne({ name: skill as string });
                if(!skillId) {
                    next(new BadReuest('Invalid skill, cannot CREATE new slot'));
                    return;
                }
            }
        } catch(err) {
            next(err);
            return;
        }

        const slotAddedValue = { tutor: userId, startTime, endTime, skill: skillId };
        let tutorSlot;
        try {
            tutorSlot = await TutorScheduleModel.create(slotAddedValue);
        } catch(err) {
            next(err);
            return;
        }
        res.status(StatusCodes.OK).json(tutorSlot);
    }

    public async handleUpdateSingleSlot(req: Request, res: Response, next: NextFunction) {
        const { slotId } = req.params as { slotId: string };
        const { startTime, endTime, skill } = req.body as ISlotUpdated;
        let skillId : Types.ObjectId | null = null;

        try {
            if(skill) {
                skillId = await SkillsModel.findOne({ name: skill as string });
                if(!skillId) {
                    next(new BadReuest('Invalid skill, cannot CREATE new slot'));
                    return;
                }
            }
        } catch(err) {
            next(err);
            return;
        }

        const slotUpdatedValue = { startTime, endTime, skill: skillId };
        let tutorSlot;
        try {
            tutorSlot = await TutorScheduleModel.findByIdAndUpdate(slotId, slotUpdatedValue, { new: true }).populate('skill');
        } catch(err) {
            next(err);
            return;
        }
        res.status(StatusCodes.OK).json(tutorSlot);
    }

    public async handleDeleteSingleSlot(req: Request, res: Response, next: NextFunction) {
        const { slotId } = req.params as { slotId: string };
        try {
            await TutorScheduleModel.findByIdAndDelete(slotId);
        } catch(err) {
            next(err);
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json();
    }
}