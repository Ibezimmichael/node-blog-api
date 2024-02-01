const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { appErr, AppErr } = require("../utils/appErr");



const adminBlock = asyncHandler(async (req, res, next) => {
    //1. find the user to be blocked
    const userToBlock= await User.findById(req.params.id);
    //2. Check if user found
    if (!userToBlock) {
      return next(appErr("User not Found"));
    }
    //Change the isBlocked to true
    userToBlock.isBlocked = true;
    //4.save
    await userToBlock.save();
    res.json({
      status: "success",
      data: "You have successfully blocked this user",
    });
});

//admin-unblock
const adminUnblock = asyncHandler(async (req, res, next) => {
    //1. find the user to be unblocked
    const userToUnblock = await User.findById(req.params.id);
    //2. Check if user found
    if (!userToUnblock) {
      return next(appErr("User not Found"));
    }
    //Change the isBlocked to false
    userToUnblock.isBlocked = false;
    //4.save
    await userToUnblock.save();
    res.json({
      status: "success",
      data: "You have successfully unblocked this user",
    });
});

module.exports = {
  adminBlock,
  adminUnblock
}