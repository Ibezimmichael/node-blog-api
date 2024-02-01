const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, profilePhoto } = req.body;
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


const profile = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth)
        res.status(201).json({ message: "User profile", data: user })

    } catch (error) {
        // console.log(error);
        throw new Error(error)

    }
};


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


//follow



const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json({ message: "Users", data: users })

    } catch (error) {
        res.status(400).json(error.message)

    }
};

const updateUser = async (req, res) => {
    try {
        res.status(201).json({ message: "Update User", data: "correct" })

    } catch (error) {
        res.status(400).json(error.message)

    }
};

const deleteUser = async (req, res) => {
    try {
        res.status(201).json({ message: "Delete User", data: "correct" })

    } catch (error) {
        res.status(400).json(error.message)

    }
};



const uploadPhoto = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth);
        // check for user
        if (!user) {
            res.status(404);
            throw new Error('User not found')
        }
        // check is user is blocked
        if (user.isBlocked) {
            res.json(402);
            throw new Error('Your account has been suspended')
        }
        // check if user is updating their photo
        if (req.file) {
            await User.findByIdAndUpdate(req.userAuth, {
                $set: {
                    profilePhoto: req.file.path,
                },
            }, {
                new: true,
            });
            res.json({
                status: "success",
                data: "You have successfully updated your profile photo",
            });
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};



module.exports = {
    register,
    login,
    profile,
    getUsers,
    updateUser,
    deleteUser,
    uploadPhoto,
    profileViewers,
};