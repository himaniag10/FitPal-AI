// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) return res.sendStatus(401); // If no token, return 401 Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return 403 Forbidden
        req.user = user; // Store the user info in the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
