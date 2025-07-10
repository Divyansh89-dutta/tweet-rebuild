import express from 'express';
import { getUserProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddlewars.js';
import { followUser, unfollowUser, getUserByUsername } from '../controllers/userController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

router.get('/:username', protect, getUserByUsername);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;
