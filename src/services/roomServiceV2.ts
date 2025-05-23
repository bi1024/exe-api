import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import RoomDetailService from "./roomDetailService.js";

const roomDetailService = new RoomDetailService();

export default class RoomService {
    public handle(socket: Socket) {
        // tutor create new room 
        // { scheduleId } : { scheduleId: string }
        async function createRoom({ scheduleId }: { scheduleId: string }) {
            const roomId = uuidV4(); 
            
            // insert room to database
            let roomAdded;
            try {
                roomAdded = await roomDetailService.handleInsertSingleRoom(scheduleId, roomId);
            } catch(err) {
                console.log(err);
            }

            // socket.emit('room-created', { roomId });
            console.log('user created the room, id: ', roomId);
            return roomAdded!.roomId;
        }

        // join existed room
        async function joinRoom({ peerId, scheduleId } : { peerId: string, scheduleId: string }) {
            let room;
            let roomId : string;
            try {
                room = await roomDetailService.handleGetSingleRoomByScheduleId(scheduleId);
            } catch(err) {
                console.log(err);
            }
            if(!room) {
                roomId = await createRoom({ scheduleId });
            } else {
                roomId = room.roomId;
                socket.join(roomId);
                socket.to(roomId).emit('user-joined', { peerId });

                socket.on('leave-room', () => {
                    console.log(`user ${peerId} left the room ${roomId}`);
                    leaveRoom({ roomId, peerId });
                })
            }
            socket.emit('join-succeed', { roomId });

            socket.on('disconnect', () => {
                console.log('user disconnected', peerId);
                leaveRoom({ roomId, peerId });
            })
        }

        function leaveRoom({ roomId, peerId }: { roomId: string, peerId: string }) {
            socket.leave(roomId);
            socket.to(roomId).emit('user-disconnected', peerId);
        }

        socket.on('create-room', createRoom);
        socket.on('join-room', joinRoom);
    }
}