const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// contoller function to authenticate user
exports.authenticateUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please Provide All the details", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // if user exists and password match then sending JWT Token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token: token });
  } catch (error) {
    next(error);
  }
};
