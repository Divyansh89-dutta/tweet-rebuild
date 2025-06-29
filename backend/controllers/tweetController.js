import Tweet from "../models/Tweet.js";

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