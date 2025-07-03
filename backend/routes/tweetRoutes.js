import express from 'express';
import { protect } from '../middlewares/authMiddlewars.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import { createTweet, likeTweet, unlikeTweet, retweet, replyToTweet, getTimeline } from '../controllers/tweetController.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, upload.single('media'), createTweet);

// like and unlike a tweet
router.post('/:id/like', protect, likeTweet);
router.post('/:id/unlike', protect, unlikeTweet);

// retweet
router.post('/:id/retweet', protect, retweet);

// reply to a tweet
router.post('/:id/reply', protect, upload.single('media'), replyToTweet);


// getTimesline 
router.get('/timeline', protect, getTimeline);

export default router;