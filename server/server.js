const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/auth'); 
const insightsRoutes = require('./routes/insights'); 

dotenv.config();

const app = express();
connectDB(); 


app.use(express.json()); 
app.use(cors()); 


app.use('/api/auth', authRoutes); 
app.use('/api/insights', insightsRoutes);


app.get('/', (req, res) => {
    res.send('FitPal Backend API is Running');
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
