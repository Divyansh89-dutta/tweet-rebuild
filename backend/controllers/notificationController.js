import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ to: req.user._id })
    .sort({ createdAt: -1 })
    .populate('from', 'username name avatar')
    .populate('tweet');

  res.status(200).json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    to: req.user._id,
  });

  if (!notification) return res.status(404).json({ message: 'Not found' });

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ message: 'Marked as read' });
};
