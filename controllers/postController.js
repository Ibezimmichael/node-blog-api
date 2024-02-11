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


const getAllPost = async(req, res) => {
    try {
        res.status(201).json({message: "All posts", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};

const getSinglePost = async(req, res) => {
    try {
        res.status(201).json({message: "get post", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
}


const updatePost = async(req, res) => {
    try {
        res.status(201).json({message: "Update post", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};


const deletePost = async(req, res) => {
    try {
        res.status(201).json({message: "Delete post", data: "correct"})
        
    } catch (error) {
        res.status(400).json(error.message)
        
    }
};



module.exports = {
    getAllPost,
    getSinglePost,
    createPost,
    updatePost,
    deletePost
};


