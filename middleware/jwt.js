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

module.exports = { authUser , authAdmin};
