import mongoose, { Schema, Types } from "mongoose";

export type IDayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ITutorSchedule {
    tutor: Types.ObjectId
    startTime: Date
    endTime: Date
    skill: null | Types.ObjectId | string
    isBooked: boolean
}

export type ISlotAdded = Pick<ITutorSchedule, 'startTime' | 'endTime' | 'skill'>;
export type ISlotUpdated = Pick<ITutorSchedule, 'startTime' | 'endTime' | 'skill'>; 

const tutorScheduleSchema = new Schema<ITutorSchedule>(
    {
        tutor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'tutorId is required']
        },
        startTime: {
            type: Schema.Types.Date,
            required: [true, 'startTime is required']
        },
        endTime: {
            type: Schema.Types.Date,
            required: [true, 'endTime is required']
        },
        skill: {
            type: Schema.Types.ObjectId,
            ref: 'Skill',
            required: false,
            default: null
        },
        isBooked: {
            type: Boolean,
            required: false,
            default: false
        }
    }
)

const TutorScheduleModel = mongoose.model<ITutorSchedule>('TutorSchedule', tutorScheduleSchema, 'tutor_schedules');

export default TutorScheduleModel;