const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isLoggedIn = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let token = req.headers.authorization.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      return res.status(500).json({
        message: "Wrong token",
      });
    }
    next();
  } else {
    return res.status(500).json({
      message: "No token received",
    });
  }
};

module.exports = { isLoggedIn };
