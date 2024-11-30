const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");
const {
  createBusRouteSchedule,
  getFilteredSchedules,
  getSchedulesByRouteId,
  getScheduleById,
  getAllSchedules,
} = require("../controllers/schedule.controller");
const { errorHandler } = require("../error/error");

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
  } else if (path === "/api/v1/schedules" && req.method === "GET") {
    try {
      await verifyToken(req, res);

      // Check for query parameters to determine filtering or fetching all
      if (Object.keys(req.query).length > 0) {
        await getFilteredSchedules(req, res);
      } else {
        await getAllSchedules(req, res);
      }
    } catch (error) {
      res.statusCode = 500;
      res.end(errorHandler(error, 500));
    }
  } else if (matchGetSchedulesByRouteId && req.method === "GET") {
    try {
      const routeId = matchGetSchedulesByRouteId[1];
      await verifyToken(req, res);
      req.routeId = routeId;
      await getSchedulesByRouteId(req, res);
    } catch (error) {}
  } else if (matchGetScheduleById && req.method === "GET") {
    try {
      const scheduleId = matchGetScheduleById[1];
      await verifyToken(req, res);
      req.scheduleId = scheduleId;
      await getScheduleById(req, res);
    } catch (error) {}
  } else {
    return false;
  }
};

module.exports = scheduleRoutes;
