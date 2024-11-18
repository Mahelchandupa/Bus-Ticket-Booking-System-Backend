const { errorHandler } = require("../error/error");

const registerBusValidator = (body) => {
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

  const { leftPosition, rightPosition, backPosition } = seatPosition;

  if (busId === undefined || busId === "") {
    return errorHandler("Bus ID is required", 400);
  } else if (busName === undefined || busName === "") {
    return errorHandler("Bus Name is required", 400);
  } else if (busType === undefined || busType === "") {
    return errorHandler("Bus Type is required", 400);
  } else if (busOwner === undefined || busOwner === "") {
    return errorHandler("Bus Owner is required", 400);
  } else if (busOwnerContact === undefined || busOwnerContact === "") {
    return errorHandler("Bus Owner Contact is required", 400);
  } else if (busOwnerEmail === undefined || busOwnerEmail === "") {
    return errorHandler("Bus Owner Email is required", 400);
  } else if (busOwnerAddress === undefined || busOwnerAddress === "") {
    return errorHandler("Bus Owner Address is required", 400);
  } else if (busOwnerNIC === undefined || busOwnerNIC === "") {
    return errorHandler("Bus Owner NIC is required", 400);
  } else if (totalSeats === undefined || totalSeats === "") {
    return errorHandler("Total Seats is required", 400);
  } else if (routeId === undefined || routeId === "") {
    return errorHandler("Route ID is required", 400);
  } else if (
    totalSeats !==
    leftPosition.numberOfRows * leftPosition.numberOfSeatsPerRow +
      rightPosition.numberOfRows * rightPosition.numberOfSeatsPerRow +
      backPosition.numberOfRows * backPosition.numberOfSeatsPerRow
  ) {
    return errorHandler("Total Seats mismatch with seat position", 400);
  } else {
    return true;
  }
};

module.exports = { registerBusValidator };
