const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const { appErr, AppErr } = require("../utils/appErr");



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



module.exports = {
    updatePassword
}
