const jwt = require("jsonwebtoken");
const { errorHandler } = require("../error/error");

const verifyToken = (req, res, role) => {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(errorHandler(401, "Unauthorized"));
      return reject(new Error("No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("JWT Verification Error:", err.message); // Log the exact error message for debugging
        if (err.name === "TokenExpiredError") {
          res.statusCode = 401;
          res.end(errorHandler(401, "Token expired"));
          return reject(new Error("Token expired"));
        } else {
          res.statusCode = 403;
          res.end(errorHandler(403, "Forbidden: Token verification failed"));
          return reject(new Error("Token verification failed"));
        }
      }
      
      // Role-based authorization
      if (role && user.role !== role) {
        res.statusCode = 403;
        res.end(errorHandler(403, "Forbidden: Insufficient Role"));
        return reject();
      }

      req.user = user;
      resolve(new Error("Insufficient role")); // Resolve if token and role are valid
    });
  });
};

module.exports = { verifyToken };
