const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user;
        next();
    });
}

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'Username or email already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Registration error', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Fetch user data using ID from the token
        if (!user) return res.sendStatus(404); // If user not found, return 404

        res.json({ username: user.username, email: user.email, profilePicture: user.profilePicture, age: user.age, height: user.height, weight: user.weight });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

module.exports = router;
