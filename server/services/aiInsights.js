const axios = require('axios');
require('dotenv').config();

const HUGGING_FACE_API_KEY = process.env.HF_API_TOKEN;
const HUGGING_FACE_MODEL_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct';

async function fetchHuggingFaceResponse(prompt) {
  try {
    const response = await axios.post(HUGGING_FACE_MODEL_URL, {
      inputs: prompt, 
    }, {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error communicating with Hugging Face API:', error.message);
    if (error.response) {
      console.error('Hugging Face API error response:', error.response.data);
    }
    throw new Error('Failed to fetch recommendations from Hugging Face.');
  }
}

function cleanResponse(responseText) {
  return responseText
    .replace(/\n+/g, ' ')   
    .replace(/\s{2,}/g, ' ')  
    .trim();                
}

async function getMealPlan(mealType, userDetails, calorieGoal) {
  const mealCalorieRanges = {
    breakfast: { min: 0.25 * calorieGoal, max: 0.3 * calorieGoal },
    snack1: { min: 0.08 * calorieGoal, max: 0.12 * calorieGoal },
    lunch: { min: 0.25 * calorieGoal, max: 0.3 * calorieGoal },
    snack2: { min: 0.08 * calorieGoal, max: 0.12 * calorieGoal },
    dinner: { min: 0.25 * calorieGoal, max: 0.3 * calorieGoal },
  };

  const mealCalorieGoal = mealCalorieRanges[mealType] || { min: 0.08 * calorieGoal, max: 0.12 * calorieGoal };

  const prompt = `
    You are a professional nutritionist. Create a detailed ${mealType} for the following details:
    - Food Preference: ${userDetails.foodPreference || 'Vegetarian'}
    - Allergies: ${userDetails.allergies || 'None'}
    - Calorie Goal for the ${mealType}: Between ${mealCalorieGoal.min} and ${mealCalorieGoal.max} calories.

    Provide the ${mealType} with:
    - Meal name
    - Calories
    - Macronutrient breakdown (Protein, Carbs, Fats)
    - Ingredients
    - Instructions
  `;

  try {
    const response = await fetchHuggingFaceResponse(prompt);
    const mealPlan = response[0]?.generated_text || `No ${mealType} plan provided.`;
    return mealPlan;
  } catch (error) {
    console.error(`Error generating ${mealType} plan:`, error);
    return `Unable to generate ${mealType} plan at this time.`;
  }
}

async function getFullNutritionPlan(userDetails) {
  const calorieGoal = userDetails.calorieGoal || 2500;  
  try {
    const breakfast = await getMealPlan('breakfast', userDetails, calorieGoal);
    const snack1 = await getMealPlan('snack1', userDetails, calorieGoal);
    const lunch = await getMealPlan('lunch', userDetails, calorieGoal);
    const snack2 = await getMealPlan('snack2', userDetails, calorieGoal);
    const dinner = await getMealPlan('dinner', userDetails, calorieGoal);

    return {
      success: true,
      fullDayMealPlan: {
        breakfast: cleanResponse(breakfast),
        snack1: cleanResponse(snack1),
        lunch: cleanResponse(lunch),
        snack2: cleanResponse(snack2),
        dinner: cleanResponse(dinner),
      },
    };
  } catch (error) {
    console.error('Error generating full day nutrition plan:', error);
    return {
      success: false,
      fullDayMealPlan: 'Unable to generate full-day nutrition plan at this time.',
    };
  }
}

async function getWorkoutPlan(userDetails) {
  const prompt = `
    You are a professional fitness trainer. Create a personalized workout plan for the following details:
    - Fitness Level: ${userDetails.fitnessLevel || 'Intermediate'}
    - Goals: ${userDetails.goals || 'Build muscle'}
    - Available Time: ${userDetails.availableTime || '45 minutes'}
    - Equipment: ${userDetails.equipment || 'Dumbbells, Barbell'}

    Provide a workout plan that includes exercises, sets, and reps.
  `;

  try {
    const response = await fetchHuggingFaceResponse(prompt);
    const workoutPlan = response[0]?.generated_text || 'No workout plan provided by the model.';
    return workoutPlan;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return 'Unable to generate workout plan at this time.';
  }
}

async function getPlans(userDetails) {
  try {
    const workoutPlan = await getWorkoutPlan(userDetails);
    const nutritionPlan = await getFullNutritionPlan(userDetails);

    return {
      success: true,
      workoutPlan,
      fullDayNutritionPlan: nutritionPlan.fullDayMealPlan,
    };
  } catch (error) {
    console.error('Error generating both plans:', error);
    return {
      success: false,
      workoutPlan: 'Unable to generate workout plan.',
      fullDayNutritionPlan: 'Unable to generate nutrition plan.',
    };
  }
}

module.exports = {
  getWorkoutPlan,
  getMealPlan,
  getFullNutritionPlan,
  getPlans,
};
