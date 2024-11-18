const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const { parseBody } = require("../utils/parseBody");
const Bus = require("../models/bus.model");
const { registerBusValidator } = require("../validators/bus.validator");
const { generateSeatLayout } = require("../utils/generateSeatLayout");

const registerBus = async (req, res) => {
  try {
    let body = await parseBody(req);

    // Validate input
    const validationResult = registerBusValidator(body);

    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

    const {
      busId,
      busName,
      busType,
      busOwner,
      busOwnerContact,
      busOwnerEmail,
      busOwnerAddress,
      busOwnerNIC,
      totalSeats,
      routeId,
      seatPosition,
    } = body;

    // generate seat layout based on seat position
    const seatLayout = generateSeatLayout(seatPosition);

    const newBus = new Bus({
      busId,
      busName,
      busType,
      busOwner,
      busOwnerContact,
      busOwnerEmail,
      busOwnerAddress,
      busOwnerNIC,
      totalSeats,
      routeId,
      seatPosition,
      seatLayout,
    });

    await newBus.save();
    res.statusCode = 201;
    res.end(responseHandler("Bus registered successfully", 201, newBus));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { registerBus };
