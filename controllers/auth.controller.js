const User = require("../models/user.model");
const { parseBody } = require("../utils/parseBody");
const { errorHandler } = require("../error/error");
const bcryptjs = require("bcryptjs");
const { signUpValidator } = require("../validators/auth.validator");
const ROLES = require("../helpers/roles");

const signUp = async (req, res) => {
  try {
    let body = await parseBody(req);

    // Validate input
    const validationResult = signUpValidator(body);
    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

    const { email, password, username } = body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      role: ROLES.USER,
    });
    await newUser.save();
    res.statusCode = 201;
    res.end(JSON.stringify("Account created successfully"));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { signUp };
