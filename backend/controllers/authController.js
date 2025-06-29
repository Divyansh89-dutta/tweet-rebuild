import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateToken } from '../utils/generateToken.js';

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
        return res.status(400).json({ message: 'Email or Username and password are required' });
    }

    const user = await User.findOne({
        $or: [
            email ? { email } : {},
            username ? { username } : {}
        ]
    }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid Username or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid Username or Password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token
    });
};
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
};