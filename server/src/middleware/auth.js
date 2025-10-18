// create a variable to get the jwt
const jwt = require("jsonwebtoken");

// write a function for authentication
function authenticate(req, res, next) {
  // store a auth. header within an incoming HTTP req in a variable
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  // verify the token to pass it or catch an err
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded info to req
    next(); // go to next middleware or route
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticate;
