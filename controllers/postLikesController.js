const Post = require("../models/Post");
const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const { appErr, AppErr } = require("../utils/appErr");

const likes = async (req, res, next) => {
    try {
        //1. Get the post
        const post = await Post.findById(req.params.id);
        //2. Check if the user has already liked the post
        const isLiked = post.likes.includes(req.userAuth);
        //3. If the user has already liked the post, unlike the post
        if (isLiked) {
            post.likes = post.likes.filter(
                like => like.toString() !== req.userAuth.toString()
            );
            await post.save();
        } else {
            //4. If the user has not liked the post, like the post
            post.likes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};



module.exports = {likes}
