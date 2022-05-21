const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please Provide A Username"],
  },
  email: {
    type: String,
    required: [true, "Please Provide An Email"],
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false,
  },
  followers: [{ type: Schema.Types.ObjectId, unique: true, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, unique: true, ref: "User" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
//hasing password before saving to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method to match passwords
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Instance method to get a JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
