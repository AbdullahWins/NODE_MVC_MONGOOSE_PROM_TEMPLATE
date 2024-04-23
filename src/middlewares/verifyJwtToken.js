const jwt = require("jsonwebtoken");

// Middleware to extract and verify JWT token
const verifyJwtToken = (req, res, next) => {
  // Extract token from query parameter
  const token = req?.query?.token;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Error verifying JWT token:", err);
      return res.status(401).send("Invalid token");
    }

    // Token is valid, user is authenticated
    req.user = decoded; // Attach decoded user information to request object
    next(); // Proceed to the next middleware
  });
};

module.exports = { verifyJwtToken };
