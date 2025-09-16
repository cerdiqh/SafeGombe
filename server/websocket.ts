import { Server as SocketIOServer, type Socket } from 'socket.io';
import { type Server as HttpServer } from 'http';
import { type Incident } from '@shared/schema';

let io: SocketIOServer | null = null;

export function initWebSocket(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-url.com' 
        : 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);

    // Handle real-time location updates
    socket.on('locationUpdate', (data: { userId: string; location: { lat: number; lng: number } }) => {
      // Broadcast to all clients except the sender
      socket.broadcast.emit('userLocationUpdate', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

export function broadcastNewIncident(incident: Incident): void {
  if (io) {
    io.emit('newIncident', incident);
  }
}
