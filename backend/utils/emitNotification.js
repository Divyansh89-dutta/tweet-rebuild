import Notification from '../models/Notification.js';

export const emitNotification = async (toUserId, type, payload) => {
  if (!global.io) return;

  // save to DB
  await Notification.create({
    type,
    from: payload.from,
    to: toUserId,
    tweet: payload.tweetId || null,
  });

  // emit in real-time
  global.io.to(toUserId.toString()).emit('notification', {
    type,
    from: payload.from,
    tweetId: payload.tweetId || null,
  });
};
