const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const { parseBody } = require("../utils/parseBody");
const Bus = require("../models/bus.model");
const { registerBusValidator } = require("../validators/bus.validator");
const { generateSeatLayout } = require("../utils/generateSeatLayout");
const mongoose = require("mongoose");
const errorMessages = require("../error/errorMesssages");

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
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Get All Buses
const getAllBuses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided
    const skip = (page - 1) * limit;

    // Fetch buses with pagination
    const buses = await Bus.find().skip(skip).limit(limit);

    // Get the total count of buses
    const totalBuses = await Bus.countDocuments();

    res.statusCode = 200;
    res.end(
      responseHandler("Fetch All Buses", 200, {
        totalBuses,
        totalPages: Math.ceil(totalBuses / limit),
        currentPage: page,
        buses,
      })
    );
  } catch (error) {
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Get Buses by Route ID
const getBusesByRouteId = async (req, res) => {
  try {
    const { routeId } = req;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [buses, totalBuses] = await Promise.all([
      Bus.find({ routeId }).skip(skip).limit(limit),
      Bus.countDocuments({ routeId }),
    ]);

    res.statusCode = 200;
    res.end(
      responseHandler("Fetch All Buses Based Route", 200, {
        totalBuses,
        totalPages: Math.ceil(totalBuses / limit),
        currentPage: page,
        buses,
      })
    );
  } catch (error) {
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
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
      res.statusCode = errorMessages.ROUTE_NOT_FOUND.statusCode;
      res.end(
        errorHandler(errorMessages.NOT_FOUND.statusCode, "Bus not found")
      );
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Fetch bus details", 200, bus));
    }
  } catch (error) {
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = { registerBus, getBusesByRouteId, getBusById, getAllBuses };
