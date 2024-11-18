const { signIn, signUp } = require("../controllers/auth.controller");

const authRoutes = async (req, res) => {
  if (req.url === "/api/v1/auth/signin" && req.method === "POST") {
    return await signIn(req, res);
  } else if (req.url === "/api/v1/auth/signup" && req.method === "POST") {
    return await signUp(req, res);
  } else {
    return false;
  }
};

module.exports = authRoutes;
