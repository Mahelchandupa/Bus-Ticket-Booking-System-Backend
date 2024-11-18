const { createBusRoute } = require("../controllers/roadRoute.controller");
const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");
const { createBusRouteSchedule } = require("../controllers/schedule.controller");

const roadRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  if (path === "/api/v1/routes" && req.method === "POST") {
    try {
      await verifyToken(req, res, ROLES.ADMIN); // Await for token verification
      await createBusRoute(req, res);
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
