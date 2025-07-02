import { createClient } from 'redis';

const redisClient = createClient({
  username: 'default',
  password: 'yAGhF1IQuFB2O5980mZgtdVnSEQ3Vc1y',
  socket: {
    host: 'redis-10104.c73.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 10104,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));
let isConnected = false;

export const connectRedis = async () => {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
};

export default redisClient;