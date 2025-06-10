import BadRequest from "@/errors/BadRequest";
import CertsModel, { ICert } from "@/models/Cert";
import User from "@/models/User";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface ITutorPending {
    _id: string
    username: string
    fullname: string
    email: string
    phone: string
    hourlyRate: number
    certifications?: ICert
}


export default class TutorsManagementController {
    public async handleGetTutorsPending(req: Request, res: Response, next: NextFunction) {
        let tutors;

        try {
            tutors = await User
                .find({ role: 'tutor', status: 'pending' });
        } catch(err) {
            next(err);
            return;
        }

        const tutorsFormatted : ITutorPending[] = [];
        for(const tutor of tutors) {
            const certs = await CertsModel.find({ tutor: tutor._id });
            const tutorFormatted = tutor.toObject() as ITutorPending;
            tutorFormatted['certifications'] = certs;
            tutorsFormatted.push(tutorFormatted);
        }
        res.status(StatusCodes.OK).json({ data: tutorsFormatted });
    }

    public async handleApproveTutorPending(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.body as { userId: string };
        let tutor;

        try {
            tutor = await User
                .findByIdAndUpdate(userId, { status: 'approved' }, { new: true });
        } catch(err) {
            next(err);
            return;
        }

        if(!tutor) {
            next(new BadRequest('userId is invalid, no tutor is found!'));
            return;
        }

        res.status(StatusCodes.OK).json({ });
    } 
}