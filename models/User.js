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
    toJSON: { virtuals: true },
});

// full name
userSchema.virtual('fullname').get(function () {
    console.log(this);
    return `${this.firstname} ${this.lastname}`
});

// initials
userSchema.virtual('initials').get(function () {
    return `${this.firstname[0].toUpperCase()}${this.lastname[0].toUpperCase()}`
});


// post count
userSchema.virtual('postCount').get(function () {
    return this.posts.length;
});

userSchema.virtual("followersCount").get(function () {
    return this.followers.length;
});

//get followers count
userSchema.virtual("followingCount").get(function () {
    return this.following.length;
});

//get viewers count
userSchema.virtual("viewersCount").get(function () {
    return this.viewers.length;
});

//get blocked count
userSchema.virtual("blockedCount").get(function () {
    return this.blocked.length;
});



module.exports = mongoose.model("User", userSchema);