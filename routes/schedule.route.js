const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");
const {
  createBusRouteSchedule,
  getScheduleByParams,
  getSchedulesByRouteId,
  getScheduleById,
} = require("../controllers/schedule.controller");

const scheduleRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  req.query = query;

  // (/api/v1/schedules/route/:id)
  const getSchedulesByRouteIdRegex = /^\/api\/v1\/schedules\/route\/(\w+)/;
  const matchGetSchedulesByRouteId = path.match(getSchedulesByRouteIdRegex);

  // (api/v1/schedules/:id) get schedule by id
  const getScheduleByIdRegex = /^\/api\/v1\/schedules\/(\w+)/;
  const matchGetScheduleById = path.match(getScheduleByIdRegex);

  if (path === "/api/v1/schedules" && req.method === "POST") {
    try {
      await verifyToken(req, res, ROLES.ADMIN);
      await createBusRouteSchedule(req, res);
    } catch (error) {}
  } else if (matchGetScheduleById && req.method === "GET") {
    try {
      const scheduleId = matchGetScheduleById[1];
      await verifyToken(req, res);
      req.scheduleId = scheduleId;
      await getScheduleById(req, res);
    } catch (error) {}
  } else if (matchGetSchedulesByRouteId && req.method === "GET") {
    try {
      const routeId = matchGetSchedulesByRouteId[1];
      await verifyToken(req, res);
      req.routeId = routeId;
      await getSchedulesByRouteId(req, res);
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
