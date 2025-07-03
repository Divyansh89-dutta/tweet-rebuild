import User from '../models/user.js';

export const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;

    if (userId.toString() === targetId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Convert IDs to string for comparison
    const isAlreadyFollowing = user.following.some(
      (id) => id.toString() === targetId
    );

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: 'You are already following this user' });
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const isFollowing = user.following.some(
      (id) => id.toString() === targetId
    );

    if (!isFollowing) {
      return res.status(400).json({ message: 'You are not following this user.' });
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

