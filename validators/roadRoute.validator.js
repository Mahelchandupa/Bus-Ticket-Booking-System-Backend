const { errorHandler } = require("../error/error");

const createRoadRouteValidator = (body) => {
  const { routeId, routeName, distanceKm, estimatedTime } = body;

  if (routeId === undefined || routeId === "") {
    return errorHandler("Route ID is required", 400);
  } else if (routeName === undefined || routeName === "") {
    return errorHandler("Route Name is required", 400);
  } else if (distanceKm === undefined || distanceKm === "") {
    return errorHandler("Distance is required", 400);
  } else if (estimatedTime === undefined || estimatedTime === "") {
    return errorHandler("Estimated Time is required", 400);
  } else {
    return true;
  }
};

module.exports = { createRoadRouteValidator };