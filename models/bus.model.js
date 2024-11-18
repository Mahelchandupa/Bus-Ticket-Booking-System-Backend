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
    busOwner: {
      type: String,
      required: true,
    },
    busOwnerContact: {
      type: String,
      required: true,
    },
    busOwnerEmail: {
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
    routeId: { type: Schema.Types.ObjectId, ref: "Route" }, // Reference to Route
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", BusSchema);
module.exports = Bus;
