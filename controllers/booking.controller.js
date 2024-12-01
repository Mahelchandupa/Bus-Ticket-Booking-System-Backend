const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const { parseBody } = require("../utils/parseBody");
const errorMessages = require("../error/errorMesssages");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const sendBookingDetails = require("../helpers/sendBookingDetails");
const sendCancelBookingDetails = require("../helpers/sendCancelBookingDetails");

// Create a booking
const bookingSeat = async (req, res) => {
  try {
    let body = await parseBody(req);
    const { userId, scheduleId, seats, paymentMethod, amount } = body;
    const schedule = await Schedule.findById(scheduleId)
      .populate("busId")
      .populate("routeId");
    const unavailableSeats = seats.filter((seat) =>
      schedule.seatStatus.find(
        (seatStatus) =>
          seatStatus.seatNumber === seat.seatNumber &&
          seatStatus.seatAvailableState === "Booked"
      )
    );

    if (unavailableSeats.length > 0) {
      res.statusCode = 400;
      return res.end(
        errorHandler(400, "Some of the seats are already booked.")
      );
    }

    const booking = new Booking({
      userId,
      scheduleId,
      paymentMethod,
      amount,
      paymentStatus: "Completed",
      transactionReference: `TRX-${Date.now()}`,
      bookingSeats: seats.map((seat) => seat.seatNumber),
    });

    schedule.seatStatus.forEach((seat) => {
      if (seats.find((s) => s.seatNumber === seat.seatNumber)) {
        seat.isBooked = true;
        seat.bookedBy = userId;
        seat.seatAvailableState = "Booked";
      }
    });

    schedule.availableSeats -= seats.length;

    const user = await User.findById(userId);

    await schedule.save();
    await booking.save();

    // Send email to user about the booking details
    await sendBookingDetails(
      user.email,
      schedule,
      seats,
      amount,
      paymentMethod,
      booking
    );

    res.statusCode = 201;
    res.end(
      responseHandler(
        "Payment successful, check your email for details",
        201,
        booking
      )
    );
  } catch (error) {
    console.log("error", error);
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const body = await parseBody(req);
    const { userId, scheduleId, seatNumber, reason } = body;

    // Find the schedule
    const schedule = await Schedule.findById(scheduleId).populate("busId");
    if (!schedule) {
      res.statusCode = 404;
      return res.end(errorHandler(404, "Schedule not found"));
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      res.statusCode = 404;
      return res.end(errorHandler(404, "User not found"));
    }

    // Check if the user is the operator for this bus
    const userByBusId = await Bus.findById(schedule.busId).populate("userId");
    const isOperator =
      userByBusId && userByBusId.userId?._id?.toString() === userId;

    console.log("isOperator", isOperator);

    // Find the booking
    let booking;
    if (isOperator) {
      // Operator can find bookings by scheduleId
      booking = await Booking.findOne({ scheduleId }).populate("userId");
    } else {
      // Users can find bookings by both userId and scheduleId
      booking = await Booking.findOne({ userId, scheduleId }).populate(
        "userId"
      );
    }

    if (!booking) {
      res.statusCode = 404;
      return res.end(errorHandler(404, "Booking not found"));
    }

    // Check the seat in the schedule
    const seat = schedule.seatStatus.find(
      (seatStatus) => seatStatus.seatNumber === seatNumber
    );

    if (!seat) {
      res.statusCode = 404;
      return res.end(errorHandler(404, "Seat not found"));
    }

    // Ensure the user is authorized to cancel the booking
    if (!isOperator && seat.bookedBy?.toString() !== userId) {
      res.statusCode = 403;
      return res.end(errorHandler(403, "Unauthorized access"));
    }

    // Update seat status in schedule
    seat.isBooked = false;
    seat.bookedBy = null;
    seat.seatAvailableState = "Available";
    schedule.availableSeats += 1;

    // Remove seat from bookingSeats array
    booking.bookingSeats = booking.bookingSeats.filter(
      (bookedSeat) => bookedSeat !== seatNumber
    );

    // Add canceled seat details to cancelSeats array
    booking.cancelSeats.push({
      seatNumber,
      cancelDate: new Date(),
      reason,
      userId,
    });

    // Save the updated schedule and booking
    await schedule.save();
    await booking.save();

    // Determine role for notification
    const role = isOperator ? "operator" : "user";

    // Send cancellation email
    await sendCancelBookingDetails(schedule, booking, reason, seatNumber, role);

    // Respond with success
    res.statusCode = 200;
    res.end(responseHandler("Booking cancelled successfully", 200));
  } catch (error) {
    console.error(error);
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        "An error occurred while canceling the booking"
      )
    );
  }
};

module.exports = { bookingSeat, cancelBooking };
