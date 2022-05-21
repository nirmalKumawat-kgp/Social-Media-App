const connectDB = require("../config/db");
const User = require("../models/User");

require("dotenv").config({ path: "../config.env" });

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://nirmalKumawat:OW5NNVOjmeoHlUXQ@cluster0.084oh.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const addTestUser = async () => {
  try {
    const user = await User.create({
      username: "nirmal_123",
      email: "testuser3@gmail.com",
      password: "nirmal123",
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

addTestUser().then((response) => console.log(response));
