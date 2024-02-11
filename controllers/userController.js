const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { appErr, AppErr } = require("../utils/appErr");
const Post = require("../models/Post");
const Category = require("../models/Category");
const Comment = require("../models/Comment");


const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword, });

    res.status(201).json({ message: "User registered", data: user })
});



const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400);
            throw new Error("Incorrect Credentials");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(400);
            throw new Error("Incorrect credentials")
        }
        res.status(200).json({
            message: "Login successful", data: {
                firstname: user.firstname,
                email: user.email,
                token: generateToken(user._id)
            }
        })

    } catch (error) {
        throw error;
    }
});





const profileViewers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const userWhoViewed = await User.findById(req.userAuth);

        if (user && userWhoViewed) {
            const isUserAlreadyViewed = user.viewers.find(
                viewer => viewer.toString() === userWhoViewed._id.toString()
            );
            if (isUserAlreadyViewed) {
                // Send a response indicating that the profile has already been viewed
                return res.status(400).json({
                    status: "error",
                    message: 'You already viewed this profile'
                });
            } else {
                user.viewers.push(userWhoViewed._id);
                await user.save();
                return res.json({
                    status: "success",
                    message: "You have successfully viewed this profile"
                });
            }
        } else {
            // Send a response indicating that either the user or the viewer was not found
            return res.status(404).json({
                status: "error",
                message: "User or viewer not found"
            });
        }
    } catch (error) {
        // Handle other unexpected errors
        console.error("Error in profileViewers:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json({ message: "Users", data: users })

    } catch (error) {
        res.status(400).json(error.message)

    }
};


const updateUser = asyncHandler(async (req, res, next) => {
    const { email, lastname, firstname } = req.body;

    try {
        // Check if email is not taken
        if (email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return next(appErr("Email is taken", 400));
            }
        }

        // Update the user
        const user = await User.findByIdAndUpdate(
            req.userAuth,
            {
                lastname,
                firstname,
                email,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        // Send success response
        res.json({
            status: "success",
            data: user,
        });
    } catch (error) {
        // Handle any errors that occur during the update operation
        return next(appErr(error.message || "Internal Server Error", 500));
    }
});



const deleteUser = async (req, res, next) => {
    try {
        //1. Find the user to be deleted
        const userTodelete = await User.findById(req.userAuth);
        // console.log(userTodelete);
        //2. find all posts to be deleted
        await Post.deleteMany({ user: req.userAuth });
        //3. Delete all comments of the user
        await Comment.deleteMany({ user: req.userAuth });
        //4. Delete all category of the user
        await Category.deleteMany({ user: req.userAuth });
        //5. delete
        await userTodelete.deleteOne();
        //send response
        return res.json({
            status: "success",
            data: "Your account has been deleted successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};





module.exports = {
    register,
    login,
    getUsers,
    updateUser,
    deleteUser,
    profileViewers,
};