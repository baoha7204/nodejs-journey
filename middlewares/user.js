import User from "../models/user.js";

export const bindReqUser = async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  const user = await User.findById(req.session.user._id);
  if (user) {
    req.user = user;
  }
  next();
};
