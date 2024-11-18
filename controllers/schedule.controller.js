const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const { parseBody } = require("../utils/parseBody");

// Assign Buses to a Specific Date with Schedule Details
const createBusRouteSchedule = async (req, res) => {
  try {
    let body = await parseBody(req);

    const {
      busId,
      routeId,
      busRouteType,
      date,
      fromCity,
      toCity,
      estimatedTime,
      fare,
      availableSeats,
      departureTime,
      arrivalTime,
      road,
      stops,
    } = body;

    // Find bus and copy seat layout
    const bus = await Bus.findById(busId);
    if (!bus) {
      res.statusCode = 404;
      return res.end(errorHandler("Bus not found", 404));
    }

    const newSchedule = new Schedule({
      busId,
      routeId,
      busRouteType,
      date,
      fromCity,
      toCity,
      estimatedTime,
      fare,
      availableSeats,
      departureTime,
      arrivalTime,
      road,
      stops,
      seatStatus: bus.seatLayout,
    });

    await newSchedule.save();

    res.statusCode = 201;
    res.end(responseHandler("Successfully bus schedule created", 201, newSchedule));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler(error, 500));
  }
};

module.exports = { createBusRouteSchedule };