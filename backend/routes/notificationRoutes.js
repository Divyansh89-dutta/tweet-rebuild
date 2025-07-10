import express from 'express';
import {
  getNotifications,
  markNotificationRead,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddlewars.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markNotificationRead);

export default router;
