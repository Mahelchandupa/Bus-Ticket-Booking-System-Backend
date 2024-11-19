const mongoose = require("mongoose");
const { Schema } = mongoose;

const StopSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  stopName: {
    type: String,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: false,
  },
});

const RoadSchema = new Schema({
  fromTown: String,
  toTown: String,
  distanceKm: Number,
  estimatedTime: String,
});

const BusScheduleSchema = new Schema({
  busId: {
    type: Schema.Types.ObjectId,
    ref: "Bus",
  },
  routeId: {
    type: Schema.Types.ObjectId,
    ref: "Route",
  },
  busRouteType: String,
  date: {
    type: Date,
    required: true,
  },
  fromCity: {
    type: String,
    required: true,
  },
  toCity: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  departureTime: {
    type: String,
    required: false,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  road: [RoadSchema],
  stops: [StopSchema],
  seatStatus: [
    {
      seatNumber: String,
      isBooked: { type: Boolean, default: false },
      bookedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    },
  ],
});

const Schedule = mongoose.model("Schedule", BusScheduleSchema);
module.exports = Schedule;
