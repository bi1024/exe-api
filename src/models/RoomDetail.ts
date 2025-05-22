import mongoose, { Schema, Types } from "mongoose";

export interface IRoomDetail {
    scheduleId: Types.ObjectId
    roomUrl: string
}

const roomDetailSchema = new Schema<IRoomDetail>(
    {
        scheduleId: {
            type: Schema.Types.ObjectId,
            ref: 'TutorSchedule',
            required: [true, 'scheduleId is required'],
            unique: [true, 'scheduleId is unique']
        },
        roomUrl: {
            type: String,
            required: [true, 'roomUrl is required'],
            unique: [true, 'roomUrl is unique']
        }
    }
)

const RoomDetailModel = mongoose.model<IRoomDetail>('RoomDetail', roomDetailSchema, 'room_details');
export default RoomDetailModel;