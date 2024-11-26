const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema Definition
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Remove unnecessary spaces
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Password must be at least 8 characters long and include a letter and a number
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Password must be at least 8 characters long and include a letter and a number.',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                // Simple email regex
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`,
        },
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.png', // URL for the user's default profile picture
    },
    age: {
        type: Number,
        min: [0, 'Age must be a positive number.'],
        max: [120, 'Age must be less than 120 years.'],
        default: null,
    },
    height: {
        type: String,
        default: '',
        validate: {
            validator: function (v) {
                // Simple regex for height format like "5'4"
                return /^(\d+)'(\d+)"?$/.test(v);
            },
            message: props => `${props.value} is not a valid height format!`,
        },
    },
    weight: {
        type: Number,
        min: [0, 'Weight must be a positive number.'],
        default: null, // Optional field
    },
    goals: {
        type: [String],
        default: [], // Array of goals
    },
    fitnessLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner', // Set a default level
    },
    dietaryPreferences: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Pescatarian'],
        default: 'Non-Vegetarian', // Default dietary preference
    },
    activityLog: {
        type: [
            {
                date: {
                    type: Date,
                    default: Date.now,
                },
                activityType: {
                    type: String,
                    required: [true, 'Activity type is required.'],
                },
                duration: {
                    type: Number,
                    required: [true, 'Duration is required.'],
                    min: [1, 'Duration must be at least 1 minute.'],
                },
                caloriesBurned: {
                    type: Number,
                    required: [true, 'Calories burned is required.'],
                    min: [0, 'Calories burned cannot be negative.'],
                },
            },
        ],
        default: [],
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Instance method to get the user's activity logs
userSchema.methods.getActivityLogs = function () {
    return this.activityLog;
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

// Add indexes for performance (frequent query fields)
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
