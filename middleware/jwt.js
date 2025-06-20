const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//User ID
const authUser = (req, res, next) => {
  try {
    const token = req.cookies.userPioneerSession;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login to proceed." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authUser };
