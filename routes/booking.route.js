const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");
const { errorHandler } = require("../error/error");
const { bookingSeat, cancelBooking } = require("../controllers/booking.controller");

const bookingRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  req.query = query;

  if (path === "/api/v1/bookings" && req.method === "POST") {
    try {
      await verifyToken(req, res, [ROLES.USER]);
      await bookingSeat(req, res);
    } catch (error) {}
  } else if (path === "/api/v1/bookings/cancel" && req.method === "POST") {
    try {
      console.log("here");
      await verifyToken(req, res, [ROLES.USER, ROLES.OPERATOR]);
      await cancelBooking(req, res);
    } catch (error) {}
  } else {
    return false;
  }
};

module.exports = bookingRoutes;
