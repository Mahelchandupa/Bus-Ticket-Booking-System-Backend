const mongoose = require("mongoose");
const { Schema } = mongoose;

const BusSchema = new Schema(
  {
    busId: {
      type: String,
      required: true,
      unique: true,
    },
    busName: {
      type: String,
      required: true,
    },
    busType: {
      type: String,
      required: true,
    },
    busOwnerContact: {
      type: String,
      required: true,
    },
    busOwnerAddress: {
      type: String,
      required: true,
    },
    busOwnerNIC: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    seatPosition: {
      leftPosition: {
        numberOfSeatsPerRow: Number,
        numberOfRows: Number,
      },
      rightPosition: {
        numberOfSeatsPerRow: Number,
        numberOfRows: Number,
      },
      backPosition: {
        numberOfSeatsPerRow: Number,
        numberOfRows: Number,
      },
    },
    seatLayout: [
      {
        seatNumber: String,
        isBooked: { type: Boolean, default: false },
      },
    ],
    routeId: { type: Schema.Types.ObjectId, ref: "Route" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
