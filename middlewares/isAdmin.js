const User = require("../models/User");
const { appErr } = require("../utils/appErr");

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userAuth)
  if (user.isAdmin) {
    return next();
  } else {
    return next(appErr("Access Denied, Admin Only", 403));
  }
};

module.exports = isAdmin;
