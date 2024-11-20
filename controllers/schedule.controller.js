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

// get Schedules By Route Id
const getSchedulesByRouteId = async (req, res) => {
  try {
    const { routeId } = req;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [schedules, totalSchedules] = await Promise.all([
      Schedule.find({ routeId }).skip(skip).limit(limit),
      Schedule.countDocuments({ routeId }),
    ]);

    if (!schedules || schedules.length === 0) {
      res.statusCode = 404;
      res.end(errorHandler("Buses are not Schedule", 404));
    } else {
      res.statusCode = 200;
      res.end(
        responseHandler("Schedules Buses", 200, {
          totalSchedules,
          totalPages: Math.ceil(totalSchedules / limit),
          currentPage: page,
          schedules,
        })
      );
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler(error, 500));
  }
};

// Get Schedule by ID
const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req;

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      res.statusCode = 404;
      res.end(errorHandler("Schedule not found", 404));
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Schedule Bus", 200, schedule));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler(error, 500));
  }
};

module.exports = {
  createBusRouteSchedule,
  getScheduleByParams,
  getSchedulesByRouteId,
  getScheduleById,
};
