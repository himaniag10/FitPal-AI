const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Connect to MongoDB if necessary
const authRoutes = require('./routes/auth'); // Authentication routes
const insightsRoutes = require('./routes/insights'); // Insights routes

dotenv.config();

const app = express();
connectDB(); // Connect to the database if necessary

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/insights', insightsRoutes); // Insights (workout & nutrition advice)

// Root endpoint
app.get('/', (req, res) => {
    res.send('FitPal Backend API is Running');
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
