const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.followUser = async (req, res, next) => {
  const { userId } = req.params;
  const authenticatedUser = await User.findById(req.user._id); // the user which sent request to follow another user

  if (userId === req.user._id) {
    return next(new ErrorResponse("Can't Follow Yourself", 400));
  }

  try {
    //checking if user exists
    let user = await User.findById(userId);

    if (!user) {
      return next(new ErrorResponse("No Such User Exists"));
    }

    let follower = authenticatedUser.following.indexOf(user._id);

    //checking if already following
    if (follower !== -1) {
      return next(new ErrorResponse("Already Following", 400));
    }

    authenticatedUser.following.unshift(user);
    user.followers.unshift(authenticatedUser);

    await authenticatedUser.save();
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  const { userId } = req.params;

  const authenticatedUser = await User.findById(req.user._id); // the user which sent request to follow another user

  if (userId === req.user._id) {
    return next(new ErrorResponse("Can't UnFollow Yourself", 400));
  }

  try {
    //checking if user exists
    let user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse("No Such User Exists"));
    }

    authenticatedUser.following.pull(user._id);
    user.followers.pull(authenticatedUser._id);

    await authenticatedUser.save();
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const user = {
    username: req.user.username,
    Followers: {
      number: req.user.followers.length,
      followers: req.user.followers,
    },
    Following: {
      number: req.user.following.length,
      following: req.user.following,
    },
  };

  res.status(200).json({ success: true, message: user });
};
