const { errorHandler } = require("../error/error");
const { isPasswordStrong, isValidEmail } = require("../helpers/validations");

const signUpValidator = (body) => {
  const { email, password, username } = body;
  if (email === undefined || email === "") {
    return errorHandler("Email is required", 400);
  } else if (password === undefined || password === "") {
    return errorHandler("Password is required", 400);
  } else if (username === undefined || username === "") {
    return errorHandler("Username is required", 400);
  } else if (isValidEmail(email) === false) {
    return errorHandler("Email is invalid", 400);
  } else if (isPasswordStrong(password) === false) {
    return errorHandler("Password is weak", 400);
  } else {
    return true;
  }
};

module.exports = { signUpValidator };
