const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");
const {
  createBusRouteSchedule,
  getScheduleByParams,
} = require("../controllers/schedule.controller");

const scheduleRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  req.query = query;

  if (path === "/api/v1/schedules" && req.method === "POST") {
    try {
      await verifyToken(req, res, ROLES.ADMIN);
      await createBusRouteSchedule(req, res);
    } catch (error) {}
  } else if (path === "/api/v1/schedules/search" && req.method === "GET") {
    try {
      await verifyToken(req, res);
      await getScheduleByParams(req, res);
    } catch (error) {}
  } else {
    return false;
  }
};

module.exports = scheduleRoutes;
