const express = require('express');
const router = express.Router();
const { getPlans } = require('../services/aiInsights');  // Import the logic to generate plans

// Route to get workout and nutrition plans
router.post('/plans', async (req, res) => {
  console.log("Received userPreferences:", req.body.userPreferences); // Add this log
  const { userPreferences } = req.body;  // Example data from the request body
 // Example data from the request body

  if (!userPreferences) {
    return res.status(400).json({ message: 'User preferences are required' });
  }

  try {
    // Call the getPlans function to fetch both workout and nutrition plans
    const { success, workoutPlan, fullDayNutritionPlan } = await getPlans(userPreferences);

    if (success) {
      res.status(200).json({
        message: 'Plans generated successfully',
        workoutPlan,
        fullDayNutritionPlan,
      });
    } else {
      res.status(500).json({
        message: 'Failed to generate plans',
        workoutPlan,
        fullDayNutritionPlan,
      });
    }
  } catch (error) {
    console.error('Error generating plans:', error);
    res.status(500).json({
      message: 'Error generating plans',
      error: error.message,
    });
  }
});

module.exports = router;
