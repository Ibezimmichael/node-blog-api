const mongoose = require('mongoose');

// create schema

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Author is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, 'Category is required'],
    },
    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
    ],
    photo: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

postSchema.pre(/^find/, function (next) {
    //add views count as virtual field
    postSchema.virtual("viewsCount").get(function () {
        const post = this;
        return post.views.length;
    });
    //add likes count as virtual field
    postSchema.virtual("likesCount").get(function () {
        const post = this;
        return post.likes.length;
    });

    //if days is less is 0 return today if days is 1 return yesterday else return days ago
    postSchema.virtual("daysAgo").get(function () {
        const post = this;
        const date = new Date(post.createdAt);
        const daysAgo = Math.floor((Date.now() - date) / 86400000);
        return daysAgo === 0
            ? "Today"
            : daysAgo === 1
                ? "Yesterday"
                : `${daysAgo} days ago`;
    });
    next();
});



module.exports = mongoose.model("Post", postSchema);