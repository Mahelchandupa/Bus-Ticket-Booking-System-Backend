const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Route = require("../models/roadRoute.model");
const { parseBody } = require("../utils/parseBody");
const {
  createRoadRouteValidator,
} = require("../validators/roadRoute.validator");

// Create a Bus Road Route
const createBusRoute = async (req, res) => {
  try {
    let body = await parseBody(req);

    // Validate input
    const validationResult = createRoadRouteValidator(body);

    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

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

// Get All Bus Road Routes
const getAllBusRoutes = async (req, res) => {
  try {
    const busRoutes = await Route.find();
    res.statusCode = 200;
    res.end(responseHandler("Fetch All Routes", 200, busRoutes));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

// Get Bus Road Route by ID
const getBusRouteById = async (req, res) => {
  try {
    const { routeId } = req;

    const busRoute = await Route.findOne({
      _id: routeId,
    });

    if (!busRoute) {
      res.statusCode = 404;
      return res.end(errorHandler("Bus route not found", 404));
    } else {
      res.statusCode = 200;
      res.end(
        responseHandler("Fetch route details", 200, busRoute)
      );
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { createBusRoute, getAllBusRoutes, getBusRouteById };