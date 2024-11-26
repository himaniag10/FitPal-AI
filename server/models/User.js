const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
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
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`,
        },
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.png', 
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
                return /^(\d+)'(\d+)"?$/.test(v);
            },
            message: props => `${props.value} is not a valid height format!`,
        },
    },
    weight: {
        type: Number,
        min: [0, 'Weight must be a positive number.'],
        default: null, 
    },
    goals: {
        type: [String],
        default: [],
    },
    fitnessLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    dietaryPreferences: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Pescatarian'],
        default: 'Non-Vegetarian',
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
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.getActivityLogs = function () {
    return this.activityLog;
};

userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email });
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
