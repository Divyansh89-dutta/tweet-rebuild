import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type: String,
        required: true,
        maxlength: 280 // Twitter's character limit
    },
    media:{
        type: String,
        default: '', // cloudinary image URL
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }],
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Tweet', tweetSchema);