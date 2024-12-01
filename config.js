const mongoose = require("mongoose");
const dotenv = require("dotenv");
mongoose.set("strictQuery", false);

dotenv.config();

const uri = process.env.MONGOOSE;

async function connectDB() {
  await mongoose.connect(uri)
    .then(() => {
      console.log("Connected to MongoDB!");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB: ", err);
      process.exit(1);
    });
}

module.exports = connectDB;
