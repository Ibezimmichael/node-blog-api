const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { appErr, AppErr } = require("../utils/appErr");





const follow = asyncHandler(async (req, res, next) => {
    //1. Find the user to follow
    const userToFollow = await User.findById(req.params.id);
    //2. Find the user who is following
    const userWhoFollowed = await User.findById(req.userAuth);

    //3. Check if user and userWhoFollowed are found
    if (userToFollow && userWhoFollowed) {
        //4. Check if userWhofollowed is already in the user's followers array
        const isUserAlreadyFollowed = userToFollow.followers.find(
            follower => follower.toString() === userWhoFollowed._id.toString()
        );
        if (isUserAlreadyFollowed) {
            return next(appErr("You are already following this user", 403));
        } else {
            //5. Push userWhoFollowed nto the user's followers array
            userToFollow.followers.push(userWhoFollowed._id);
            //push userToFollow to the userWhoFollowed's following array
            userWhoFollowed.following.push(userToFollow._id);
            //save
            await userWhoFollowed.save();
            await userToFollow.save();
            res.json({
                status: "success",
                data: "You have successfully followed this user",
            });
        }
    }

});


//unfollow
const unFollow = asyncHandler(async (req, res, next) => {

    //1. Find the user to unfolloW
    const userToUnfollow = await User.findById(req.params.id);
    //2. Find the user who is unfollowing
    const userWhoFollows = await User.findById(req.userAuth);
    //3. Check if user and userWhoUnFollowed are found
    if (userToUnfollow && userWhoFollows) {
        //4. Check if userWhoUnfollowed is already in the user's followers array
        const isUserAlreadyFollowed = userToUnfollow.followers.find(
            follower => follower.toString() === userWhoFollows._id.toString()
        );
        if (!isUserAlreadyFollowed) {
            return next(appErr("You are not following this user", 403));
        } else {
            //5. Remove userWhoUnFollowed from the user's followers array
            userToUnfollow.followers = userToUnfollow.followers.filter(
                follower => follower.toString() !== userWhoFollows._id.toString()
            );
            //save the user
            await userToUnfollow.save();
            //7. Remove userToBeInfollowed from the userWhoUnfollowed's following array
            userWhoFollows.following = userWhoFollows.following.filter(
                following =>
                    following.toString() !== userToUnfollow._id.toString()
            );

            //8. save the user
            await userWhoFollows.save();
            res.json({
                status: "success",
                data: "You have successfully unfollowed this user",
            });
        }
    }

});


module.exports = {
    follow,
    unFollow

}