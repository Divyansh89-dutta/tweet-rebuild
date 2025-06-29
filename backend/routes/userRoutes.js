import express from 'express';
import { protect } from '../middlewares/authMiddlewars.js';
import { followUser, unfollowUser } from '../controllers/userController.js';

const router = express.Router();

// Follow a user / unfollow a user
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;