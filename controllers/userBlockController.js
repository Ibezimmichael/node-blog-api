const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { appErr, AppErr } = require("../utils/appErr");




const block = asyncHandler(async (req, res, next) => {
    //1. Find the user to be blocked
    const userToBlock = await User.findById(req.params.id);
    //2. Find the user who is blocking
    const userBlocking = await User.findById(req.userAuth);
    //3. Check if userToBeBlocked and userWhoBlocked are found
    if (userBlocking && userToBlock) {
        //4. Check if userWhoUnfollowed is already in the user's blocked array
        const isUserAlreadyBlocked = userBlocking.blocked.find(
            blocked => blocked.toString() === userToBlock._id.toString()
        );
        if (isUserAlreadyBlocked) {
            return next(appErr("You already blocked this user", 403));
        }
        //7.Push userToBleBlocked to the userWhoBlocked's blocked arr
        userBlocking.blocked.push(userToBlock._id);
        //8. save
        await userBlocking.save();
        res.json({
            status: "success",
            data: "You have successfully blocked this user",
        });
    }
});

const unblock = asyncHandler(async (req, res, next) => {
    //1. find the user to be unblocked
    const userToUnblock = await User.findById(req.params.id);
    //2. find the user who is unblocking
    const userWhoUnBlocked = await User.findById(req.userAuth);
    //3. check if userToBeUnBlocked and userWhoUnblocked are found
    if (userToUnblock && userWhoUnBlocked) {
        //4. Check if userToBeUnBlocked is already in the arrays's of userWhoUnBlocked
        const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
            blocked => blocked.toString() === userToUnblock._id.toString()
        );
        if (!isUserAlreadyBlocked) {
            return next(appErr("You have not blocked this user"));
        }
        //Remove the userToBeUnblocked from the main user
        userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
            blocked => blocked.toString() !== userToUnblock._id.toString()
        );
        //Save
        await userWhoUnBlocked.save();
        res.json({
            status: "success",
            data: "You have successfully unblocked this user",
        });
    }

});


module.exports = {
    block,
    unblock

}