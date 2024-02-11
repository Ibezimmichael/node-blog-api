const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const { appErr, AppErr } = require("../utils/appErr");

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth)
        res.status(201).json({ message: "User profile", data: user })

    } catch (error) {
        // console.log(error);
        throw new Error(error)

    }
};

const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    // Check if both old and new passwords are provided
    if (!oldPassword || !newPassword) {
        return next(appErr("Please provide both old and new passwords"));
    }

    // Find the user
    const user = await User.findById(req.userAuth);

    // Check if the user exists
    if (!user) {
        return next(appErr("User not found"));
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(appErr("Incorrect old password"));
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    await User.findByIdAndUpdate(
        req.userAuth,
        { password: hashedPassword },
        { new: true, runValidators: true }
    );

    res.json({
        status: "success",
        data: "Password has been changed successfully",
    });

});





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
    updatePassword,
    uploadPhoto,
    profile
}
