const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connectDB() {
  await mongoose
    .connect(process.env.MONGOOSE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB: ", err);
    });
}

module.exports = connectDB;
