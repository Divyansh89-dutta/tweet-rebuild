import express from 'express';
import { protect } from '../middlewares/authMiddlewars.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import { createTweet } from '../controllers/tweetController.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, upload.single('media'), createTweet);

export default router;