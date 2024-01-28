const mongoose = require('mongoose');

// create schema

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First Name is required'],
    },
    lastname: {
        type: String,
        required: [true, 'Last Name is required'],
    },
    profilePhoto: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true, 'Email is required'],
    },
    bio: {
        type: String,
    },
    // postCount: {
    //     type: Number,
    //     default: 0,
    // },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor'],
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    // active: {
    //     type: Boolean,
    //     default: true,
    // },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    blocked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    plan: [
        {
            type: String,
            enum: ['Free', 'Premium', 'Pro'],
            default: 'Free',
        }
    ]
}, {
    timestamps: true,
});


module.exports = mongoose.model("User", userSchema);