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
    photo: {
        type: String,   
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("Post", postSchema);