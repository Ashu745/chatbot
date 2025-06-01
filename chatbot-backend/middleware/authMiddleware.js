const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Check if there's an authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // If the token is present, verify it using JWT_SECRET
      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user data (user ID) to the request object
      req.user = decoded; // This will allow access to `req.user.id` in the route handlers
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = protect;
