const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const { parseBody } = require("../utils/parseBody");
const {
  createBusRouteScheduleValidator,
  filterScheduleByParamsValidator,
} = require("../validators/schedule.validator");
const errorMessages = require("../error/errorMesssages");

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
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Get Schedule of Buses by Params - from, to, date
const getFilteredSchedules = async (req, res) => {
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

    const filteredSchedules = await Schedule.find({
      fromCity: from,
      toCity: to,
      date: date,
    }).populate("busId");

    if (filteredSchedules.length === 0) {
      res.statusCode = errorMessages.NOT_FOUND.statusCode;
      res.end(
        errorHandler(
          errorMessages.ROUTE_NOT_FOUND.statusCode,
          "No schedules found"
        )
      );
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Filtered Schedules", 200, filteredSchedules));
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
      res.statusCode = errorMessages.NOT_FOUND.statusCode;
      res.end(
        errorHandler(
          errorMessages.NOT_FOUND.statusCode,
          "Buses are not Schedule"
        )
      );
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
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Get Schedule by ID
const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req;

    const schedule = await Schedule.findById(scheduleId).populate("busId");

    if (!schedule) {
      res.statusCode = errorMessages.NOT_FOUND.statusCode;
      res.end(
        errorHandler(errorMessages.NOT_FOUND.statusCode, "Schedule not found")
      );
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Schedule Bus", 200, schedule));
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

// Get All Schedules
const getAllSchedules = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const schedules = await Schedule.find().skip(skip).limit(limit);
    const totalSchedules = await Schedule.countDocuments();

    res.statusCode = 200;
    res.end(
      responseHandler("All Schedules", 200, {
        totalSchedules,
        totalPages: Math.ceil(totalSchedules / limit),
        currentPage: page,
        schedules,
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

const bookSeat = async (req, res, io) => {
  const { scheduleId, seatNumber, userId } = req.body;

  try {
    // Step 1: Find and lock the seat
    const schedule = await Schedule.findOneAndUpdate(
      {
        _id: scheduleId,
        "seatStatus.seatNumber": seatNumber,
        "seatStatus.seatAvailableState": "Available",
      },
      {
        $set: { "seatStatus.$.seatAvailableState": "Processing" },
      },
      { new: true }
    );

    if (!schedule) {
      return res
        .status(400)
        .json({ message: "Seat is already booked or being processed." });
    }

    // Emit real-time update to all clients
    io.emit("seatStatusUpdate", {
      scheduleId,
      seatNumber,
      state: "Processing",
    });

    // Step 2: Simulate booking processing
    setTimeout(async () => {
      const bookedSchedule = await Schedule.findOneAndUpdate(
        {
          _id: scheduleId,
          "seatStatus.seatNumber": seatNumber,
          "seatStatus.seatAvailableState": "Processing",
        },
        {
          $set: {
            "seatStatus.$.seatAvailableState": "Booked",
            "seatStatus.$.isBooked": true,
            "seatStatus.$.bookedBy": userId,
          },
        },
        { new: true }
      );

      if (bookedSchedule) {
        io.emit("seatStatusUpdate", {
          scheduleId,
          seatNumber,
          state: "Booked",
        });
        res.status(200).json({ message: "Seat booked successfully." });
      } else {
        // Handle rollback if the seat wasn't properly processed
        await Schedule.updateOne(
          {
            _id: scheduleId,
            "seatStatus.seatNumber": seatNumber,
          },
          { $set: { "seatStatus.$.seatAvailableState": "Available" } }
        );
        io.emit("seatStatusUpdate", {
          scheduleId,
          seatNumber,
          state: "Available",
        });
        res.status(500).json({ message: "Seat booking failed. Try again." });
      }
    }, 5000); // Simulating delay for booking confirmation
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBusRouteSchedule,
  getFilteredSchedules,
  getSchedulesByRouteId,
  getScheduleById,
  getAllSchedules,
  bookSeat,
};
