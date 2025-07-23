const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//User ID
const authUser = (req, res, next) => {
  try {
    // console.log("Cookies received:", req.cookies); // Debug
    const token = req.cookies.userPioneerSession;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login to proceed." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded); // Debug
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT error:", error); // Debug
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

//Administrator ID
const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.pioneerAdminSession;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login to proceed." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.error("JWT error:", error); // Debug
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Allow either user or admin
const authUserOrAdmin = (req, res, next) => {
  const userToken = req.cookies.userPioneerSession;
  const adminToken = req.cookies.pioneerAdminSession;

  if (userToken) {
    try {
      const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      return next();
    } catch (err) {
      console.error("JWT error (user):", err);
    }
  }

  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      req.adminId = decoded.adminId;
      console.log("Authenticated as admin");
      return next();
    } catch (err) {
      console.error("JWT error (admin):", err);
    }
  }

  return res.status(401).json({ message: "Unauthorized access" });
};

module.exports = { authUser, authAdmin , authUserOrAdmin};
