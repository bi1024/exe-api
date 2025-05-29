import mongoose, { Schema, Types } from "mongoose";

export interface IRoomDetail {
    scheduleId: Types.ObjectId
    roomId: string
}

const roomDetailSchema = new Schema<IRoomDetail>(
    {
        scheduleId: {
            type: Schema.Types.ObjectId,
            ref: 'TutorSchedule',
            required: [true, 'scheduleId is required'],
            unique: [true, 'scheduleId is unique']
        },
        roomId: {
            type: String,
            required: [true, 'roomId is required'],
            unique: [true, 'roomId is unique']
        }
    }
)

const RoomDetailModel = mongoose.model<IRoomDetail>('RoomDetail', roomDetailSchema, 'room_details');
export default RoomDetailModel;