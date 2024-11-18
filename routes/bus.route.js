const { registerBus } = require("../controllers/bus.controller");
const { ROLES } = require("../helpers/roles");
const { verifyToken } = require("../utils/verifyUser");
const { parse } = require("url");
const querystring = require("querystring");

const busRoutes = async (req, res) => {
  const parsedUrl = parse(req.url);
  const path = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query);

  if (path === "/api/v1/buses" && req.method === "POST") {
    try {
      await verifyToken(req, res, ROLES.ADMIN); // Await for token verification
      await registerBus(req, res);
    } catch (error) {}
  } else {
    return false;
  }
};

module.exports = busRoutes;
