import Tweet from "../models/Tweet.js";
import redisClient from "../utils/redisClient.js";

export const createTweet = async(req, res) => {
    const { content } = req.body;
    const user = req.user;

    let mediaUrl = null;
    if(req.file){
        mediaUrl = req.file.path; // Assuming the file is uploaded using multer and the path is stored in req.file.path
    }
    const tweet = await Tweet.create({
        user: user._id,
        content,
        media: mediaUrl,
    });
    res.status(201).json(tweet);
}

export const likeTweet = async(req, res)=>{
    const tweet = await Tweet.findById(req.params.id);
    if(!tweet) return res.status(404).json({ message: 'Tweet not found' });
    if(!tweet.likes.includes(req.user._id)){
        tweet.likes.push(req.user._id);
        await tweet.save();
    }
    return res.status(200).json({ message: 'Tweet liked' });
}

export const unlikeTweet = async(req, res) => {
    const tweet = await Tweet.findById(req.params.id);
    if(!tweet) return res.status(404).json({ message: 'Tweet not found' });
    tweet.likes = tweet.likes.filter((id) => id.toString() !== req.user._id.toString());
    await tweet.save();
    res.status(200).json({ message: 'Tweet unliked' });
}

export const retweet = async(req, res) => {
    const originalTweet = await Tweet.findById(req.params.id);
    if(!originalTweet) return res.status(404).json({ message: 'Tweet not found' });

    const newTweet = await Tweet.create({
        user: req.user._id,
        content: originalTweet.content,
        media: originalTweet.media,
        parent: originalTweet._id
    })

    originalTweet.retweets.push(newTweet._id);
    await originalTweet.save();

    res.status(201).json({ message: 'Tweet retweeted'});
}

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
    parentTweet.replies.push(replyTweet._id);
    await parentTweet.save();

    res.status(201).json(replyTweet);
};

export const getTimeline = async (req, res) => {
  const userId = req.user._id.toString();
  const cacheKey = `timeline:${userId}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
    const user = await User.findById(userId).select('following');

    const tweets = await Tweet.find({
      user: { $in: [userId, ...user.following] }
    })
      .populate('user', 'username name avatar')
      .populate('parent', 'user content')
      .sort({ createdAt: -1 })
      .limit(50);
    await redisClient.set(cacheKey, JSON.stringify(tweets), {
      EX: 60, 
    });
    res.status(200).json(tweets);
  } catch (err) {
    console.error('Timeline error:', err);
    res.status(500).json({ message: 'Error fetching timeline' });
  }
};