import RoomDetailModel from "@/models/RoomDetail.js";
import { Types } from "mongoose";

export default class RoomDetailService {
    public async handleInsertSingleRoom(scheduleId: string | Types.ObjectId, roomUrl: string) {
        const room = await RoomDetailModel.create({ scheduleId, roomUrl });
        return room;
    }

    public async handleGetSingleRoom(scheduleId: string | Types.ObjectId) {
        const room = await RoomDetailModel.findOne({ scheduleId });
        return room;
    }
}