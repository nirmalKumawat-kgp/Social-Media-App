require("dotenv").config({ path: "../config.env" });
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Bearer <token>
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedToken.id)
      .populate("followers")
      .populate("following");

    if (!user) {
      return next(new ErrorResponse("No user found", 404));
    }

    req.user = user; // making the user details except password accessible on req object

    next();
  } catch (error) {
    next(error);
  }
};
