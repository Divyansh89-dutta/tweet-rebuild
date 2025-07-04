import Tweet from "../models/Tweet.js";
import redisClient from "../utils/redisClient.js";
import User from "../models/user.js";
import { io } from "../server.js";

export const createTweet = async (req, res) => {
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

  await tweet.populate("user", "username name avatar");

  // emit new tweet
  io.emit("newTweet", tweet);

  res.status(201).json(tweet);
};

export const likeTweet = async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);
  if (!tweet) return res.status(404).json({ message: "Tweet not found" });

  if (!tweet.likes.includes(req.user._id)) {
    tweet.likes.push(req.user._id);
    await tweet.save();
  }

  await tweet.populate("user", "username name avatar");

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

  io.emit("likeUpdated", tweet);

  res.status(200).json(tweet);
};

export const retweet = async (req, res) => {
  const originalTweet = await Tweet.findById(req.params.id);
  if (!originalTweet)
    return res.status(404).json({ message: "Tweet not found" });

  const newTweet = await Tweet.create({
    user: req.user._id,
    content: originalTweet.content,
    media: originalTweet.media,
    parent: originalTweet._id,
  });

  await newTweet.populate("user", "username name avatar");

  originalTweet.retweets.push(newTweet._id);
  await originalTweet.save();

  io.emit("retweetCreated", newTweet);

  res.status(201).json(newTweet);
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
      .populate("parent", "user content")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "username name avatar",
        }
      })
      .sort({ createdAt: -1 })
      .limit(50);

    await redisClient.set(cacheKey, JSON.stringify(tweets), { EX: 60 });
    console.log("Timeline fetched from MongoDB and saved to Redis");

    return res.status(200).json(tweets);
  } catch (err) {
    console.error("Timeline Error:", err);
    res.status(500).json({ message: "Error fetching timeline" });
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