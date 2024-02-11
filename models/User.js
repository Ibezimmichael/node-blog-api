const mongoose = require('mongoose');
const Post = require('./Post');

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
    comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
    ],
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



userSchema.pre("findOne", async function (next) {
    //populate the post
    this.populate({
        path: "posts",
    });
    //get the user id
    const userId = this._conditions._id;
    //find the post created by the user
    // const lastPost = await Post.findOne({ user: userId }).sort({ createdAt: -1 }).limit(1);

    const posts = await Post.find({ user: userId });
    //get the last post created by the user
    const lastPost = posts[posts.length - 1];

    //get the last post date
    const lastPostDate = new Date(lastPost?.createdAt);
    //get the last post date in string format
    const lastPostDateStr = lastPostDate.toDateString();
    //add virtuals to the schema
    userSchema.virtual("lastPostDate").get(function () {
        return lastPostDateStr;
    });

    //------------------Check if user is inactive for 30 days------------------
    //get current date
    const currentDate = new Date();
    //get the difference between the last post date and the current date
    const diff = currentDate - lastPostDate;
    //get the difference in days and return less than in days
    const diffInDays = diff / (1000 * 3600 * 24);

    if (diffInDays > 30) {
        //Add virtuals isInactive to the schema to check if a user is inactive for 30 days
        userSchema.virtual("isInactive").get(function () {
            return true;
        });
        //Find the user by ID and update
        await User.findByIdAndUpdate(
            userId,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
    } else {
        userSchema.virtual("isInactive").get(function () {
            return false;
        });
        //Find the user by ID and update
        await User.findByIdAndUpdate(
            userId,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
    }

    //------Last Active Date-------

    //convert to days ago, for example 1 day ago
    const daysAgo = Math.floor(diffInDays);
    //add virtuals lastActive in days to the schema
    userSchema.virtual("lastActive").get(function () {
        //check if daysAgo is less than 0
        if (daysAgo <= 0) {
            return "Today";
        }
        //check if daysAgo is equal to 1
        if (daysAgo === 1) {
            return "Yesterday";
        }
        //check if daysAgo is greater than 1
        if (daysAgo > 1) {
            return `${daysAgo} dasy ago`;
        }
    });
    next();
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

const User = mongoose.model("User", userSchema);

module.exports = User;