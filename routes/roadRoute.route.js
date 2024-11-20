const {
  createBusRoute,
  getAllBusRoutes,
  getBusRouteById,
} = require("../controllers/roadRoute.controller");
const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");
const {
  createBusRouteSchedule,
} = require("../controllers/schedule.controller");

const roadRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  req.query = query;

  // (/api/v1/routes/:id)
  const getBusRoadRouteByIdRegex = /^\/api\/v1\/routes\/(\w+)/;
  const matchGetBusRoadRouteById = path.match(getBusRoadRouteByIdRegex);

  if (path === "/api/v1/routes" && req.method === "POST") {
    try {
      await verifyToken(req, res, ROLES.ADMIN); // Await for token verification
      await createBusRoute(req, res);
    } catch (error) {}
  } else if (path === "/api/v1/routes" && req.method === "GET") {
    try {
      await verifyToken(req, res);
      await getAllBusRoutes(req, res);
    } catch (error) {}
  } else if (matchGetBusRoadRouteById && req.method === "GET") {
    try {
      const routeId = matchGetBusRoadRouteById[1];
      await verifyToken(req, res);
      req.routeId = routeId;
      await getBusRouteById(req, res);
    } catch (error) {}
  } else if (path === "/api/v1/routes/schedules" && req.method === "POST") {
    try {
      await verifyToken(req, res, ROLES.ADMIN);
      await createBusRouteSchedule(req, res);
    } catch (error) {}
  } else {
    return false;
  }
};

module.exports = roadRoutes;
