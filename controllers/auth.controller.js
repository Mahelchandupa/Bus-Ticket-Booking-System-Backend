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
      res.statusCode = 404;
      return res.end(errorHandler("User not found", 404));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      res.statusCode = 401;
      return res.end(errorHandler("Wrong credentials!", 401));
    }
    // Generate token
    const token = generateJwtToken(validUser);
    const { password: pass, ...userInfo } = validUser._doc;
    res.statusCode = 200;
    // res.cookie("access_token", token, { httpOnly: true });
    res.end(JSON.stringify({ message: "Login successful", token, userInfo }));
  } catch (error) {
    res.statusCode = 500;
    res.end(errorHandler("Internal Server Error", 500));
  }
};

module.exports = { signIn, signUp };
