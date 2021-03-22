const { User } = require("../models/User");
const { sendFlashMessage } = require("./utils/respond");

exports.saveFacultyAndSemester = (req, res, next) => {
  let user = new User(req.user);
  user
    .saveFacultyAndSemester(req.body.faculty, req.body.semester)
    .then(() =>
      res
        .status(202)
        .json({ message: "Faculty and Semester Saved Successfully." })
    )
    .catch((error) => res.status(400).json(error));
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.user && req.user.faculty && req.user.semester) {
    next();
    return;
  } else {
    return sendFlashMessage({
      collection: "errors",
      message: "You must be logged in to perform that action",
      redirectURL: "/",
    });
  }
};

exports.checkSessionCount = (req, res, next) => {
  if (req.user.sessionCount < 3) {
    return next();
  }
  return sendFlashMessage({
    collection: "errors",
    message: "Account is being used in more than 2 devices",
    redirectURL: "/",
  });
};

exports.mustBeApproved = (req, res, next) => {
  if (req.user.isApproved) {
    next();
    return;
  } else {
    res
      .status(403)
      .json({ message: "You are not approved to access this page" });
  }
};

exports.checkSubscriptionStatus = (req, res, next) => {
  if (!req.user.isSubscriptionExpired) {
    next();
    return;
  } else
    res.status(403).json({
      message: "Your subscription has expired, UPGRADE your account.",
    });
};

exports.authRole = (role) => {
  return (req, res, next) => {
    if (req.user.roles.includes(role)) {
      return next();
    } else {
      res.status(403);
      return res.json({ message: "This route is restricted to admin(s) only" });
    }
  };
};
