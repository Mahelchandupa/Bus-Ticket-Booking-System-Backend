const jwt = require("jsonwebtoken");
const { errorHandler } = require("../error/error");
const errorMessages = require("../error/errorMesssages");

const verifyToken = (req, res, role) => {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = errorMessages.UNAUTHORIZED.statusCode;
      res.end(
        errorHandler(errorMessages.UNAUTHORIZED.statusCode, "Unauthorized")
      );
      return reject(new Error("No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.statusCode = errorMessages.UNAUTHORIZED.statusCode;
          res.end(
            errorHandler(errorMessages.UNAUTHORIZED.statusCode, "Token expired")
          );
          return reject(new Error("Token expired"));
        } else {
          res.statusCode = errorMessages.FORBIDDEN.statusCode;
          res.end(
            errorHandler(
              errorMessages.FORBIDDEN.statusCode,
              "Forbidden: Token verification failed"
            )
          );
          return reject(new Error("Token verification failed"));
        }
      }

      // Role-based authorization
      if (role && user.role !== role) {
        res.statusCode = errorMessages.FORBIDDEN.statusCode;
        res.end(
          errorHandler(
            errorMessages.FORBIDDEN.statusCode,
            "Forbidden: Insufficient Role"
          )
        );
        return reject();
      }

      req.user = user;
      resolve(new Error("Insufficient role")); // Resolve if token and role are valid
    });
  });
};

module.exports = { verifyToken };
