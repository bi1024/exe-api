import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./lib/db.js";
import { Socket, Server as SocketServer } from 'socket.io';

import RoomService from "./services/roomServiceV2.js";

const roomService = new RoomService();

connectDB().then(() => {
  const httpServer = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
  const io = new SocketServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  io.on('connection', (socket: Socket) => {
    console.log('user is connected');

    roomService.handle(socket);

    socket.on('disconnect', () => {
      console.log('user is disconnected');
    })
  })
});
