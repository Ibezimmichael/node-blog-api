const Post = require("../models/Post");
const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const { appErr, AppErr } = require("../utils/appErr");





const createPost = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
        //Find the user
        const author = await User.findById(req.userAuth);
        //check if the user is blocked
        if (author.isBlocked) {
            return next(appErr("Access denied, account blocked", 403));
        }
        //Create the post
        const postCreated = await Post.create({
            title,
            description,
            user: author._id,
            category,
            photo: req?.file?.path,
        });
        //Associate user to a post -Push the post into the user posts field
        author.posts.push(postCreated);
        //save
        await author.save();
        res.json({
            status: "success",
            data: postCreated,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};




//all
const getAllPost = async (req, res, next) => {
    try {
        //Find all posts
        const posts = await Post.find({})
            .populate("user")
            .populate("category", "title");

        //Check if the user is blocked by the post owner
        const filteredPosts = posts.filter(post => {
            //get all blocked users
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);

            // return isBlocked ? null : post;
            return !isBlocked;
        });

        res.json({
            status: "success",
            data: filteredPosts,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const getSinglePost = async (req, res, next) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //Number of view
        //check if user viewed this post
        const isViewed = post.views.includes(req.userAuth);
        if (isViewed) {
            res.json({
                status: "success",
                data: post,
            });
        } else {
            //pust the user into numOfViews

            post.views.push(req.userAuth);
            //save
            await post.save();
            res.json({
                status: "success",
                data: post,
            });
        }
    } catch (error) {
        next(appErr(error.message));
    }
};



const updatePost = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
        //find the post
        const post = await Post.findById(req.params.id);
        //check if the post belongs to the user

        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this post", 403));
        }
        await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                photo: req?.file?.path,
            },
            {
                new: true,
            }
        );
        res.json({
            status: "success",
            data: post,
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//Delete
const deletePost = async (req, res, next) => {
    try {
        //check if the post belongs to the user

        //find the post
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this post", 403));
        }
        await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            data: "Post deleted successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};



module.exports = {
    getAllPost,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
};


