import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateToken } from '../utils/generateToken.js';
import { io } from '../server.js';
import Tweet from '../models/Tweet.js';

export const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body;

    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        username,
        email,
        password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token
    });
};

export const loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
        return res
            .status(400)
            .json({ message: 'Email or Username and password are required' });
    }

    let user = null;

    if (email && username) {
        // Either email or username matches
        user = await User.findOne({
            $or: [{ email }, { username }]
        }).select('+password');
    } else if (email) {
        user = await User.findOne({ email }).select('+password');
    } else if (username) {
        user = await User.findOne({ username }).select('+password');
    }

    if (!user) {
        return res
            .status(401)
            .json({ message: 'Invalid Username or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res
            .status(401)
            .json({ message: 'Invalid Username or Password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token,
    });
};
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');

        const tweets = await Tweet.find({ user: user._id }.sort({ createdAt: -1 }));
        const savedTweets = await Tweet.find({ savedBy: user._id }).sort({ createdAt: -1 });

        const userData = user.toObject();
        userData.tweets = tweets;
        userData.savedTweets = savedTweets;

        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, boi, location, website } = req.body;
        const avatarUrl = req.file?.path;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.boi = boi || user.boi;
        user.avatar = avatarUrl || user.avatar;
        user.location = location || user.location;
        user.website = website || user.website;

        await user.save();

        io.to(user._id.toString()).emit('profileUpdated', {
            _id: user._id,
            name: user.name,
            boi: user.boi,
            avatar: user.avatar,
            location: user.location,
            website: user.website
        });
        res.status(200).json({
            user
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}