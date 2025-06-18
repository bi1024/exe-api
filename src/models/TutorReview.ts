import mongoose, { Schema, Types } from "mongoose";

export type ITutorRating = 0 | 1 | 2 | 3 | 4 | 5; 

export interface ITutorReview {
    student: Types.ObjectId
    tutor: Types.ObjectId
    rating: ITutorRating
    comment: string | null
}

const tutorReviewSchema = new Schema<ITutorReview>({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'student is required'],
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'tutor is required'],
    },
    rating: {
        type: Number,
        required: [true, 'rating is required']
    },
    comment: {
        type: String,
        required: false,
        default: null
    }
}, {
    timestamps: true
})  

// todo: why not work?
tutorReviewSchema.index({ student: 1, tutor: 1 }, { unique: true });

export const TutorReviewModel = mongoose.model<ITutorReview>('TutorReview', tutorReviewSchema, 'tutor_reviews');