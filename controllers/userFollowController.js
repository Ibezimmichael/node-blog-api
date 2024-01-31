const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require('../models/User');
const generateToken = require('../utils/generateToken');




const follow = asyncHandler(async (req, res) => {
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
            res.status(403)
                .json({ error: "You are already following this user" });;
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
const unFollow = async (req, res, next) => {
    try {
        //1. Find the user to unfolloW
        const userToBeUnfollowed = await User.findById(req.params.id);
        //2. Find the user who is unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth);
        //3. Check if user and userWhoUnFollowed are found
        if (userToBeUnfollowed && userWhoUnFollowed) {
            //4. Check if userWhoUnfollowed is already in the user's followers array
            const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(
                follower => follower.toString() === userWhoUnFollowed._id.toString()
            );
            if (!isUserAlreadyFollowed) {
                return next(appErr("You have not followed this user"));
            } else {
                //5. Remove userWhoUnFollowed from the user's followers array
                userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
                    follower => follower.toString() !== userWhoUnFollowed._id.toString()
                );
                //save the user
                await userToBeUnfollowed.save();
                //7. Remove userToBeInfollowed from the userWhoUnfollowed's following array
                userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
                    following =>
                        following.toString() !== userToBeUnfollowed._id.toString()
                );

                //8. save the user
                await userWhoUnFollowed.save();
                res.json({
                    status: "success",
                    data: "You have successfully unfollowed this user",
                });
            }
        }
    } catch (error) {
        next(appErr(error.message));
    }
};


module.exports = {
    follow,
    unFollow

}