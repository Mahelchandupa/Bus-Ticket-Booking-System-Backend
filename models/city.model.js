const mongoose = require("mongoose");
const { Schema } = mongoose;

const CitySchema = new Schema({
  districtId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  district: {
    type: Number,
    required: false,
  },
  provice: {
    type: String,
    required: false,
  },
});

const Route = mongoose.model("City", CitySchema);
module.exports = Route;
