import Tweet from "../models/Tweet.js";
import redisClient from "../utils/redisClient.js";
import User from "../models/user.js";
import { io } from "../server.js";

export const createTweet = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    let mediaUrl = null;
    if (req.file) {
      mediaUrl = req.file.path;
    }

    const tweet = await Tweet.create({
      user: user._id,
      content,
      media: mediaUrl,
    });

    // Push tweet ID to user's tweets array
    await User.findByIdAndUpdate(
      user._id,
      { $push: { tweets: tweet._id } }
    );

    await tweet.populate("user", "username name avatar");

    // Invalidate Redis cache
    await redisClient.del("timeline:global");

    io.emit("newTweet", tweet);

    res.status(201).json(tweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const likeTweet = async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) return res.status(404).json({ message: "Tweet not found" });

  if (!tweet.likes.includes(req.user._id)) {
    tweet.likes.push(req.user._id);
    await tweet.save();
  }

  await tweet.populate("user", "username name avatar");
  await tweet.populate({
    path: "replies",
    populate: {
      path: "user",
      select: "username name avatar",
    },
  });
  await tweet.populate({
    path: "parent",
    populate: { path: "user", select: "username name avatar" }
  });

  io.emit("likeUpdated", tweet);
  res.status(200).json(tweet);
};

export const unlikeTweet = async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) return res.status(404).json({ message: "Tweet not found" });

  tweet.likes = tweet.likes.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await tweet.save();

  await tweet.populate("user", "username name avatar");

  await tweet.populate({
    path: "replies",
    populate: {
      path: "user",
      select: "username name avatar",
    },
  });

  await tweet.populate({
    path: "parent",
    populate: { path: "user", select: "username name avatar" },
  });

  io.emit("likeUpdated", tweet);
  res.status(200).json(tweet);
};

export const retweet = async (req, res) => {
  const { content } = req.body;
  const tweetId = req.params.id;

  try {
    const original = await Tweet.findById(tweetId);
    if (!original) {
      return res.status(404).json({ message: "Original tweet not found" });
    }

    const retweet = await Tweet.create({
      user: req.user._id,
      content,
      parent: tweetId,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { tweets: retweet._id }
    });

    const populated = await Tweet.findById(retweet._id)
      .populate("user", "username name avatar")
      .populate({
        path: "parent",
        populate: { path: "user", select: "username name avatar" },
      });

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const replyToTweet = async (req, res) => {
  const { content } = req.body;
  const parentTweet = await Tweet.findById(req.params.id);
  if (!parentTweet) {
    return res.status(404).json({ message: 'Parent tweet not found' });
  }

  let mediaUrl = '';
  if (req.file) {
    mediaUrl = req.file.path;
  }

  const replyTweet = await Tweet.create({
    user: req.user._id,
    content,
    media: mediaUrl,
    parent: parentTweet._id
  });

  await replyTweet.populate("user", "username name avatar");

  parentTweet.replies.push(replyTweet._id);
  await parentTweet.save();

  // emit socket event
  io.emit("replyCreated", replyTweet);

  res.status(201).json(replyTweet);
};

export const getTimeline = async (req, res) => {
  const cacheKey = `timeline:global`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Timeline served from Redis Cache");
      return res.status(200).json(JSON.parse(cached));
    }

    const tweets = await Tweet.find()
      .populate("user", "username name avatar")
      .populate({
        path: "parent",
        populate: { path: "user", select: "username name avatar" },
      })
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "username name avatar",
        },
      })
      .sort({ createdAt: -1 })
      .limit(50);

    await redisClient.set(cacheKey, JSON.stringify(tweets), { EX: 60 });
    console.log("Timeline fetched from MongoDB and saved to Redis");

    return res.status(200).json(tweets);
  } catch (err) {
    console.error("Timeline Error:", err);
    return res.status(500).json({ message: "Error fetching timeline" });
  }
};


export const saveTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    if (tweet.savedBy.includes(req.user._id)) {
      return res.status(400).json({ message: "Tweet already saved" });
    }

    tweet.savedBy.push(req.user._id);
    await tweet.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedTweets: tweet._id },
    });

    const updated = await Tweet.findById(tweet._id)
      .populate("user", "username name avatar")
      .populate({
        path: "parent",
        populate: { path: "user", select: "username name avatar" },
      });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unsaveTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    tweet.savedBy = tweet.savedBy.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await tweet.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedTweets: tweet._id }
    });

    const updated = await Tweet.findById(tweet._id)
      .populate("user", "username name avatar")
      .populate({
        path: "parent",
        populate: { path: "user", select: "username name avatar" },
      });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Tweet.findByIdAndDelete(tweet._id);

    await User.findByIdAndUpdate(tweet.user, {
      $pull: { tweets: tweet._id }
    });

    await User.updateMany(
      { savedTweets: tweet._id },
      { $pull: { savedTweets: tweet._id } }
    );

    // ✅ Invalidate timeline cache
    await redisClient.del("timeline:global");

    io.emit("tweetDeleted", tweet._id);

    return res.json({ message: "Tweet deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const editTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    tweet.content = req.body.content;
    await tweet.save();

    const updated = await Tweet.findById(tweet._id)
      .populate("user", "username name avatar")
      .populate({
        path: "parent",
        populate: { path: "user", select: "username name avatar" }
      })
      .populate({
        path: "replies",
        populate: { path: "user", select: "username name avatar" }
      });

    // ✅ Invalidate timeline cache
    await redisClient.del("timeline:global");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id)
      .populate("user", "username name avatar")
      .populate({
        path: "parent",
        populate: { path: "user", select: "username name avatar" },
      })
      .populate({
        path: "replies",
        populate: { path: "user", select: "username name avatar" },
      });

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.json(tweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



