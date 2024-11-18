const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Route = require("../models/roadRoute.model");
const { parseBody } = require("../utils/parseBody");

// Create a Bus Route
const createBusRoute = async (req, res) => {
  try {
    let body = await parseBody(req);

    const { routeId, routeName, distanceKm, estimatedTime } = body;

    const newBusRoute = new Route({
      routeId,
      routeName,
      distanceKm,
      estimatedTime,
    });

    await newBusRoute.save();
    res.statusCode = 201;
    res.end(responseHandler("Bus route created successfully", 201));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { createBusRoute };
