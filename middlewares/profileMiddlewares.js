const User = require("../models/userModel");

const getUserById = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userid).select("-password");
    if (user === null) {
      return res.json({
        error: "Not authorized",
      });
    }
    req.profile = user;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "No such user exists",
    });
  }
};

module.exports = { getUserById };
