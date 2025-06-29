import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import tweetRoute from './routes/tweetRoutes.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
});
app.use(limiter);


app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/tweets', tweetRoute);
// app.use(errorHandler);

export default app;
