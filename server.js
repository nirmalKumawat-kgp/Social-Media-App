require("dotenv").config({ path: "./config.env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;

const app = express();

//connecting to Database
connectDB();

app.use(express.json());

app.use("/api", require("./routes/index"));

app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

//looking for unhandledRejection error
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error : ${err.message}`);
  server.close(() => process.exit(1));
});
