const axios = require('axios');

const userPreferences = {
  calorieGoal: 2500,
  foodPreference: "Vegetarian",
  allergies: "None",
  fitnessLevel: "Intermediate",
  goals: "Build muscle",
  availableTime: "45 minutes",
  equipment: "Dumbbells, Barbell"
};

axios.post('http://localhost:5000/api/insights/plans', { userPreferences })
  .then((response) => {
    console.log('Response from API:', response.data);
  })
  .catch((error) => {
    console.error('Error making request:', error.response ? error.response.data : error.message);
  });
