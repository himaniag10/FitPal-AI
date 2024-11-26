const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Middleware function to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // Get the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

    if (!token) return res.sendStatus(401); // 401: Unauthorized if no token is found

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // 403: Forbidden if the token is invalid
        req.user = user; // Attach the user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
}

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'Username or email already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds to 12 for better security
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
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
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT token (expires in 7 days)
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

// Profile route
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Fetch user data using ID from the token
        if (!user) return res.sendStatus(404); // If user not found, return 404

        // Respond with user details
        res.json({ username: user.username, email: user.email, profilePicture: user.profilePicture, age: user.age, height: user.height, weight: user.weight });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

module.exports = router;
