const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header is present and starts with "Bearer"
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token is found, return an unauthorized error
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        // Verify the token and decode its payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user associated with the decoded token and attach it to the request object, excluding the password field for security reasons
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

const requireAttendant = (req, res, next) => {
    // Check if the user is authenticated and has the "attendant" role, allowing access to the next middleware or route handler if the check passes, or returning a forbidden error if it fails
    if (req.user && req.user.role === "Attendant") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden, attendant role required" });
    }
};

const restrictToOwnProfile = async (req, res, next) => {
  try {
    // attendants can update anyone
    if (req.user.role === "Attendant") return next();

    // students can only update their own profile
    // req.user.profile is the student's profile ObjectId
    if (req.user.profile.toString() !== req.params.id) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    protect, 
    requireAttendant, 
    restrictToOwnProfile 
};

