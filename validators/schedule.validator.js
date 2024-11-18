const { errorHandler } = require("../error/error");

const createBusRouteScheduleValidator = (body) => {
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

  if (busId === undefined || busId === null) {
    return errorHandler("Bus ID is required", 400);
  } else if (routeId === undefined || routeId === null) {
    return errorHandler("Route ID is required", 400);
  } else if (busRouteType === undefined || busRouteType === null) {
    return errorHandler("Bus Route Type is required", 400);
  } else if (date === undefined || date === null) {
    return errorHandler("Date is required", 400);
  } else if (fromCity === undefined || fromCity === null) {
    return errorHandler("From City is required", 400);
  } else if (toCity === undefined || toCity === null) {
    return errorHandler("To City is required", 400);
  } else if (estimatedTime === undefined || estimatedTime === null) {
    return errorHandler("Estimated Time is required", 400);
  } else if (fare === undefined || fare === null) {
    return errorHandler("Fare is required", 400);
  } else if (availableSeats === undefined || availableSeats === null) {
    return errorHandler("Available Seats is required", 400);
  } else if (departureTime === undefined || departureTime === null) {
    return errorHandler("Departure Time is required", 400);
  } else if (arrivalTime === undefined || arrivalTime === null) {
    return errorHandler("Arrival Time is required", 400);
  } else {
    return true;
  }
};

module.exports = { createBusRouteScheduleValidator };