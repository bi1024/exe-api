import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import RoomDetailService from "./roomDetailService.js";

const roomDetailService = new RoomDetailService();

// manage rooms, object include key is roomId and value is array of userId joining the room 
const rooms : Record<string, string[]> = {};

interface IRoomParams {
    roomId: string
    peerId: string
}

export default class RoomService {
    public handle(socket: Socket) {
        // tutor create new room 
        // { scheduleId } : { scheduleId: string }
        async function createRoom() {
            const roomId = uuidV4();

            // await roomDetailService.handleInsertSingleRoom(scheduleId, roomId);

            rooms[roomId] = [];
            socket.emit('room-created', { roomId });
            console.log('user created the room, id: ', roomId);
        }

        // join existed room
        function joinRoom({ roomId, peerId }: IRoomParams) {
            if(rooms[roomId]) { // check roomId đã tồn tại chưa
                console.log(`user ${peerId} joined the room ${roomId}`);
                rooms[roomId].push(peerId);
                socket.join(roomId);
                socket.to(roomId).emit('user-joined', { peerId });
                socket.to(roomId).emit('get-users', {
                    roomId, 
                    participants: rooms[roomId]
                })

                socket.on('leave-room', () => {
                    console.log(`user ${peerId} left the room ${roomId}`);
                    if(rooms[roomId]) {
                        const peer = rooms[roomId].find(currentPeer => currentPeer === peerId);
                        console.log('peer found', peer);
                        if(peer) leaveRoom({ roomId, peerId });
                    }
                })
            } else {
                createRoom();
            }

            socket.on('disconnect', () => {
                console.log('user disconnected', peerId);
                if(rooms[roomId]) {
                    const peer = rooms[roomId].find(currentPeer => currentPeer === peerId);
                    console.log('peer found', peer);
                    if(peer) leaveRoom({ roomId, peerId });
                }
            })
        }

        function leaveRoom({ roomId, peerId }: IRoomParams) {
            if(rooms[roomId]) {
                rooms[roomId] = rooms[roomId].filter(currentPeer => currentPeer !== peerId);
                socket.to(roomId).emit('user-disconnected', peerId);
            }
            if(!rooms[roomId] || !rooms[roomId].length) {
                console.log('Delete room', rooms[roomId]);
                delete rooms[roomId];
                console.log(rooms[roomId]);
            }
        }

        socket.on('create-room', createRoom);
        socket.on('join-room', joinRoom);
    }
}