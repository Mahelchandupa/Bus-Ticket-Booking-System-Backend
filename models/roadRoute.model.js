const mongoose = require("mongoose");
const { Schema } = mongoose;

const RouteSchema = new Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
  },
  routeName: {
    type: String,
    required: false,
  },
  distanceKm: {
    type: Number,
    required: false,
  },
  estimatedTime: {
    type: String,
    required: false,
  },
});

const Route = mongoose.model("Route", RouteSchema);
module.exports = Route;
