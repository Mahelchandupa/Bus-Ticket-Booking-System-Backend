const {
  registerBus,
  getAllBuses,
  getBusById,
  getBusesByRouteId,
} = require("../controllers/bus.controller");
const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");

const busRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  req.query = query;

  // (/api/v1/buses/:id)
  const getBusByIdRegex = /^\/api\/v1\/buses\/(\w+)/;
  const matchGetBusById = path.match(getBusByIdRegex);

  // (/api/v1/buses/route/:id)
  const getBusesByRouteIdRegex = /^\/api\/v1\/buses\/route\/(\w+)/;
  const matchGetBusesByRouteId = path.match(getBusesByRouteIdRegex);

  if (path === "/api/v1/buses" && req.method === "POST") {
    try {
      await verifyToken(req, res, [ROLES.ADMIN]);
      await registerBus(req, res);
    } catch (error) {}
  } else if (path === "/api/v1/buses" && req.method === "GET") {
    try {
      await verifyToken(req, res);
      await getAllBuses(req, res);
    } catch (error) {}
  } else if (matchGetBusesByRouteId && req.method === "GET") {
    try {
      const routeId = matchGetBusesByRouteId[1];
      await verifyToken(req, res);
      req.routeId = routeId;
      await getBusesByRouteId(req, res);
    } catch (error) {}
  } else if (matchGetBusById && req.method === "GET") {
    try {
      const busId = matchGetBusById[1];
      await verifyToken(req, res);
      req.busId = busId;
      await getBusById(req, res);
    } catch (error) {}
  } else {
    return false;
  }
};

module.exports = busRoutes;
