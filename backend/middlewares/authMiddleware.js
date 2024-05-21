// middlewares/authMiddleware.js
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {

    const token = req.header("Authorization");

    if (!token) {
      return next(createHttpError.Unauthorized("No token provided"));
    }

    const bearerToken = token.split(" ")[1];

    const decoded = await jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);
    // const decoded = await jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return next(createHttpError.Unauthorized("Invalid token"));
  }
};

module.exports = authMiddleware;