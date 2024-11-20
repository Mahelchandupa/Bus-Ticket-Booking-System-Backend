const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const { parseBody } = require("../utils/parseBody");
const {
  createBusRouteScheduleValidator,
  filterScheduleByParamsValidator,
} = require("../validators/schedule.validator");

// Assign Buses to a Specific Date with Schedule Details
const createBusRouteSchedule = async (req, res) => {
  try {
    let body = await parseBody(req);

    // Validate input
    const validationResult = createBusRouteScheduleValidator(body);

    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

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
    res.end(
      responseHandler("Successfully bus schedule created", 201, newSchedule)
    );
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler(error, 500));
  }
};

// Get Schedule of Buses by Params - from, to, date
const getScheduleByParams = async (req, res) => {
  try {
    console.log('called')
    const { from, to, date } = req.query;

    // Validate input
    const validationResult = filterScheduleByParamsValidator({
      from,
      to,
      date,
    });

    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

    const schedule = await Schedule.find({
      fromCity: from,
      toCity: to,
      date: date,
    });

    if (!schedule || schedule.length === 0) {
      res.statusCode = 404;
      res.end(errorHandler("Buses are not Schedule", 404));
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Schedules Buses", 200, schedule));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler(error, 500));
  }
};

module.exports = { createBusRouteSchedule, getScheduleByParams };
