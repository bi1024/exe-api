import mongoose, { Schema, Types } from "mongoose";

export type ILessonStatus = 'upcoming' | 'ongoing' | 'completed'

export interface ILesson {
    tutor: Types.ObjectId
    student: Types.ObjectId
    startTime: Date
    endTime: Date
    skill: Types.ObjectId
    title: string
    description: string
    status: ILessonStatus
}

const lessonSchema = new Schema<ILesson>(
    {
        tutor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'tutorId is required for lessonSchema']
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'studentId is required for lessonSchema']
        },
        startTime: {
            type: Date,
            required: [true, 'startTime is required']
        },
        endTime: {
            type: Date,
            required: [true, 'startTime is required']
        },
        skill: {
            type: Schema.Types.ObjectId,
            ref: 'Skill',
            required: true,
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
            default: ''
        },
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed'],
            required: true
        }
    }
)

const LessonModel = mongoose.model<ILesson>('Lesson', lessonSchema);
export default LessonModel;