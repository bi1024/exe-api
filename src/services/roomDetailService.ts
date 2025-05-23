import RoomDetailModel from "@/models/RoomDetail.js";
import { Types } from "mongoose";

export default class RoomDetailService {
    public async handleInsertSingleRoom(scheduleId: string | Types.ObjectId, roomId: string) {
        const room = await RoomDetailModel.create({ scheduleId, roomId });
        return room;
    }

    public async handleGetSingleRoomByScheduleId(scheduleId: string | Types.ObjectId) {
        const room = await RoomDetailModel.findOne({ scheduleId });
        return room;
    }

    public async handleGetSingleRoomByRoomId(roomId: string | Types.ObjectId) {
        const room = await RoomDetailModel.findOne({ roomId });
        return room;
    }
}