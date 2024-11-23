const User = require("../models/user.model");
const { parseBody } = require("../utils/parseBody");
const { errorHandler } = require("../error/error");
const bcryptjs = require("bcryptjs");
const {
  signUpValidator,
  signInValidator,
} = require("../validators/auth.validator");
const ROLES = require("../helpers/roles");
const generateJwtToken = require("../utils/generateJwtToken");
const errorMessages = require("../error/errorMesssages");

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
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const signIn = async (req, res) => {
  try {
    let body = await parseBody(req);

    // Validate input
    const validationResult = signInValidator(body);

    if (validationResult !== true) {
      res.statusCode = 400;
      return res.end(validationResult);
    }

    const { email, password } = body;

    let validUser = await User.findOne({ email });

    if (!validUser) {
      res.statusCode = errorMessages.ROUTE_NOT_FOUND.statusCode;
      return res.end(
        errorHandler(errorMessages.ROUTE_NOT_FOUND.statusCode, "User not found")
      );
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      res.statusCode = errorMessages.UNAUTHORIZED.statusCode;
      return res.end(
        errorHandler(
          errorMessages.UNAUTHORIZED.statusCode,
          "Wrong credentials!"
        )
      );
    }
    // Generate token
    const token = generateJwtToken(validUser);
    const { password: pass, ...userInfo } = validUser._doc;
    res.statusCode = 200;
    // res.cookie("access_token", token, { httpOnly: true });
    res.end(JSON.stringify({ message: "Login successful", token, userInfo }));
  } catch (error) {
    res.statusCode = errorMessages.INTERNAL_SERVER_ERROR.statusCode;
    res.end(
      errorHandler(
        errorMessages.INTERNAL_SERVER_ERROR.statusCode,
        errorMessages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = { signIn, signUp };
