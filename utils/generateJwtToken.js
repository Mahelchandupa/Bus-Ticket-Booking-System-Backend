const jwt = require("jsonwebtoken");

const generateJwtToken = (user) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(
    { _id: user._id, role: user.role, email: user.email },
    secret,
    {
      expiresIn: "1h",
    }
  );
};

module.exports = generateJwtToken;
