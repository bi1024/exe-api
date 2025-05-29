import TutorScheduleModel from "@/models/TutorSchedule.js";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default class StudentBookingController {
    public async handleGetSlotsAvailableOfTutor(req: Request, res: Response, next: NextFunction) {
        const { tutorId } = req.query as { tutorId: string };
        
        let tutorSlotsAvailable;
        try {
            tutorSlotsAvailable = await TutorScheduleModel.find({ tutor: tutorId, isBooked: false }).populate('skill');
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json(tutorSlotsAvailable);
    }
}