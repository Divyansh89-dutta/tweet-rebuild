import Tweet from '../models/Tweet.js';
import User from '../models/user.js';

export const searchAll = async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).json({ message: 'Query missing' });

  const userRegex = new RegExp(query, 'i');

  const users = await User.find({
    $or: [
      { username: { $regex: userRegex } },
      { name: { $regex: userRegex } }
    ]
  }).select('username name avatar');

  const tweets = await Tweet.find({
    content: { $regex: userRegex }
  })
    .populate('user', 'username name avatar')
    .sort({ createdAt: -1 })
    .limit(30);

  res.status(200).json({ users, tweets });
};
