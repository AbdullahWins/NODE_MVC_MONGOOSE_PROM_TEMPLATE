const jwt = require("jsonwebtoken");
const { logger } = require("../../src/services/loggers/Winston");

const jwtSecret = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN;

const generateToken = (payload) => {
  try {
    const token = jwt.sign({ email: payload }, jwtSecret, {
      expiresIn: expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate JWT token");
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    logger.log("info", `Decoded token: ${decoded}`);
    return decoded;
  } catch (error) {
    logger.log("error", `Error verifying JWT token:: ${error}`);
    throw new Error("Failed to verify JWT token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
