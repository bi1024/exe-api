import PaymentTransaction from "@/models/payment/PaymentTransaction";
import { ITutorRating, TutorReviewModel } from "@/models/TutorReview";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export class TutorReviewController {
    
    // get list of tutors that students have learned 
    public async handleGetTutorsLearnedBefore(req: Request, res: Response, next: NextFunction) {
        const userId = new mongoose.Types.ObjectId(req.user!.userId as string);
        // const userId = new mongoose.Types.ObjectId('682a7dbf0b3b48fae953d916');
        let tutors;

        try {
            tutors = await PaymentTransaction.aggregate([

                {
                    // match userId and status success
                    $match: {
                        userId: userId,
                        status: 'success'
                    }
                },

                {
                    // join tutor_schedules table in scheduleId field
                    $lookup: {
                        from: 'tutor_schedules',
                        localField: 'scheduleId',
                        foreignField: '_id',
                        as: 'scheduleDetails'
                    }
                },
                {
                    // array -> object 
                    $unwind: '$scheduleDetails'
                },
                {
                    // group by tutorId
                    $group: {
                        _id: '$scheduleDetails.tutor'
                    }
                },
                {
                    // change field _id to tutorId, ignore _id field
                    $project: {
                        tutorId: '$_id',
                        _id: 0
                    }
                },
                {
                    // join users table in tutorId field
                    $lookup: {
                        from: 'users',
                        localField: 'tutorId',
                        foreignField: '_id',
                        as: 'tutor'
                    }
                },
                {
                    $unwind: '$tutor'
                },
                {
                    // ignore tutorId field
                    $project: {
                        tutorId: 0
                    }
                }
            ])
        } catch(err) {
            next(err);
            return;
        }

        tutors = tutors.map(element => element.tutor);
        const tutorsResponsed = [];
        try {
            for(const tutor of tutors) {
                const review = await TutorReviewModel.findOne({ student: userId, tutor: tutor._id }).select('rating comment');
                if(review) {
                    tutorsResponsed.push({...tutor, review });
                } else {
                    tutorsResponsed.push({...tutor, rating: 0, review: null });
                }
            }
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json({ data: tutorsResponsed });
    }

    public async handleInsertTutorReview(req: Request, res: Response, next: NextFunction) {
        const userId = req.user!.userId;
        const { tutorId } = req.body as { tutorId: string };
        const { rating, comment } = req.body as { rating: ITutorRating, comment: string };

        try {
            await TutorReviewModel.create({
                student: userId,
                tutor: tutorId,
                rating,
                comment: comment ? comment : null
            })
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.CREATED).json({ message: 'success' });
    }

    public async handleUpdateTutorReview(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params as { reviewId: string };
        const { rating, comment } = req.body as { rating: ITutorRating, comment: string };

        try {
            await TutorReviewModel.findByIdAndUpdate(reviewId, { rating, comment });
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json({ message: 'success' });
    }

    public async handleGetReviewsOfTutor(req: Request, res: Response, next: NextFunction) {
        const { tutorId } = req.params as { tutorId: string };
        let reviews;
        try {
            reviews = await TutorReviewModel.find({ tutor: tutorId }).populate('student');
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json({ data: reviews });
    }
}