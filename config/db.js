require("dotenv").config({ path: "../config.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connection to database established");
  } catch (error) {
    //to handle initial errors
    console.log(`Connection to database failed: ${error}`);
  }

  //to handle errors after initial connection was established
  mongoose.connection.on("error", (err) => {
    console.log(`After Connection Error :${err}`);
  });
};
module.exports = connectDB;
