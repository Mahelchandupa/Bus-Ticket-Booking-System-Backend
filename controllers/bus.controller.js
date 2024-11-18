const { errorHandler } = require("../error/error");
const { responseHandler } = require("../utils/responseHandler");
const { parseBody } = require("../utils/parseBody");
const Bus = require("../models/bus.model");

const registerBus = async (req, res) => {
  try {
    let body = await parseBody(req);

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
    } = body;

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
    });

    await newBus.save();
    res.statusCode = 201;
    res.end(responseHandler("Bus registered successfully", 201));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { registerBus };