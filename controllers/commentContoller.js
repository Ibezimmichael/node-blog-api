const Post = require("../models/Post");
const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const { appErr, AppErr } = require("../utils/appErr");
const Comment = require('../models/Comment');

const createComment = async (req, res, next) => {
    const { description } = req.body;
    try {
        //Find the post
        const post = await Post.findById(req.params.id);
        console.log(post);
        //create comment
        const comment = await Comment.create({
            post: post._id,
            description,
            user: req.userAuth,
        });
        //push the comment to post
        post.comments.push(comment._id);
        //Find the user
        const user = await User.findById(req.userAuth);
        //Push to user
        user.comments.push(comment._id);
        //save
        //Disable validation
        await post.save({ validateBeforeSave: false });
        await user.save({ validateBeforeSave: false });

        res.json({
            status: "success",
            data: comment,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//delete
const deleteComment = async (req, res, next) => {
    try {
        //find the Comment
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to update this comment", 403));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Comment has been deleted successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//update
const updateComment = async (req, res, next) => {
    const { description } = req.body;
    try {
        //find the Comment
        const comment = await Comment.findById(req.params.id);
        console.log(req.userAuth);
        if (comment.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to update this comment", 403));
        }

        const comm = await Comment.findByIdAndUpdate(
            req.params.id,
            { description },
            { new: true, runValidators: true }
        );
        res.json({
            status: "success",
            data: comm,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};



module.exports = {
    createComment,
    updateComment,
    deleteComment
}