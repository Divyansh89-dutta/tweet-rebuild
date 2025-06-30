import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';
import redisClient from './utils/redisClient.js';

const PORT = process.env.PORT || 5000;

connectDB().then(async() => {
    await redisClient.connect();
    console.log('Connected to MongoDB and Redis');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    });
});