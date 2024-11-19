const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const { parseBody } = require("../utils/parseBody");
const Bus = require("../models/bus.model");
const { registerBusValidator } = require("../validators/bus.validator");
const { generateSeatLayout } = require("../utils/generateSeatLayout");
const mongoose = require("mongoose");

const registerBus = async (req, res) => {
  try {
    let body = await parseBody(req);

    // Validate input
    const validationResult = registerBusValidator(body);

    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

    const {
      busId,
      busName,
      busType,
      busOwner,
      busOwnerContact,
      busOwnerEmail,
      busOwnerAddress,
      busOwnerNIC,
      totalSeats,
      routeId,
      seatPosition,
    } = body;

    // generate seat layout based on seat position
    const seatLayout = generateSeatLayout(seatPosition);

    const newBus = new Bus({
      busId,
      busName,
      busType,
      busOwner,
      busOwnerContact,
      busOwnerEmail,
      busOwnerAddress,
      busOwnerNIC,
      totalSeats,
      routeId,
      seatPosition,
      seatLayout,
    });

    await newBus.save();
    res.statusCode = 201;
    res.end(responseHandler("Bus registered successfully", 201, newBus));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

// Get All Buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();

    res.statusCode = 200;
    res.end(responseHandler("Fetch All Buses", 200, buses));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

// Get Buses by Route ID
const getBusesByRouteId = async (req, res) => {
  try {
    console.log('called')
    const { routeId } = req;

    const buses = await Bus.find({
      routeId: routeId,
    });

    res.statusCode = 200;
    res.end(responseHandler("Fetch All Buses Based Route", 200, buses));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

// Get Bus by ID
const getBusById = async (req, res) => {
  try {
    const { busId } = req;

    // Validate busId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      res.statusCode = 400;
      return res.end(errorHandler("Invalid Bus ID", 400));
    }

    const bus = await Bus.findOne({
      _id: busId,
    });

    if (!bus) {
      res.statusCode = 404;
      res.end(errorHandler("Bus not found", 404));
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Fetch bus details", 200, bus));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { registerBus, getBusesByRouteId, getBusById, getAllBuses };
