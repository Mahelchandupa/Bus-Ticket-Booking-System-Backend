const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const Route = require("../models/roadRoute.model");
const { parseBody } = require("../utils/parseBody");
const {
  createRoadRouteValidator,
} = require("../validators/roadRoute.validator");
const City = require("../models/city.model");

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
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// Get All Bus Road Routes
const getAllBusRoutes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const busRoutes = await Route.find().skip(skip).limit(limit);

    const totalBusRoutes = await Route.countDocuments();

    res.statusCode = 200;
    res.end(
      responseHandler("Fetch All Routes", 200, {
        totalBusRoutes,
        totalPages: Math.ceil(totalBusRoutes / limit),
        currentPage: page,
        busRoutes,
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

// Get Bus Road Route by ID
const getBusRouteById = async (req, res) => {
  try {
    const { routeId } = req;

    const busRoute = await Route.findOne({
      _id: routeId,
    });

    if (!busRoute) {
      res.statusCode = 404;
      return res.end(
        errorHandler(
          errorMessages.ROUTE_NOT_FOUND.statusCode,
          errorMessages.ROUTE_NOT_FOUND.message
        )
      );
    } else {
      res.statusCode = 200;
      res.end(responseHandler("Fetch route details", 200, busRoute));
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

// Get All Cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();

    res.statusCode = 200;
    res.end(responseHandler("Fetch All Cities", 200, cities));
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

module.exports = {
  createBusRoute,
  getAllBusRoutes,
  getBusRouteById,
  getAllCities,
};
