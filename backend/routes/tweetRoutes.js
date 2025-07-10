import express from 'express';
import { protect } from '../middlewares/authMiddlewars.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';
import {
  createTweet,
  likeTweet,
  unlikeTweet,
  retweet,
  replyToTweet,
  getTimeline,
  saveTweet,
  unsaveTweet,
  deleteTweet,
  editTweet,
  getTweetById
} from '../controllers/tweetController.js';

const router = express.Router();
const upload = multer({ storage });

// ✅ Timeline routes first
router.get('/timeline', protect, getTimeline);


// ✅ Tweet creation
router.post('/', protect, upload.single('media'), createTweet);

// ✅ Tweet actions
router.post('/:id/like', protect, likeTweet);
router.post('/:id/unlike', protect, unlikeTweet);
router.post('/:id/retweet', protect, retweet);
router.post('/:id/reply', protect, upload.single('media'), replyToTweet);

router.post("/:id/save", protect, saveTweet);
router.post("/:id/unsave", protect, unsaveTweet);
router.delete("/:id", protect, deleteTweet);
router.put("/:id", protect, editTweet);
router.get("/:id", getTweetById);


export default router;
