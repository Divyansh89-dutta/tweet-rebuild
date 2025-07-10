
import User from '../models/user.js';
import Tweet from '../models/Tweet.js';

export const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;

    if (userId.toString() === targetId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const isAlreadyFollowing = user.following.some(
      (id) => id.toString() === targetId
    );

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    user.following.push(targetUser._id);
    targetUser.followers.push(user._id);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: 'User followed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = user.following.some(
      (id) => id.toString() === targetId
    );

    if (!isFollowing) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== targetId
    );

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId.toString()
    );

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: 'User unfollowed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', '_id username name')
      .populate('following', '_id username name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tweets = await Tweet.find({ user: user._id });

    const userData = user.toObject();
    userData.tweets = tweets;

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



