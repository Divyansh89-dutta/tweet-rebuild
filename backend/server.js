import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import client from './utils/redisClient.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

global.io = io; 

io.on('connection', (socket) => {
   console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // user joins their own room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

connectDB().then(async () => {
  await client.connect();
  console.log('Connected to MongoDB and Redis');

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
