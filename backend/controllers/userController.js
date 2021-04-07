const { User } = require("@models/User");

exports.saveFacultyAndSemester = (req, res) => {
  const user = new User(req.user);
  console.log(req.body.faculty, req.body.semester);
  user
    .saveFacultyAndSemester(req.body.faculty, req.body.semester)
    .then(() =>
      res
        .status(202)
        .json({ message: "Faculty and Semester Saved Successfully." })
    )
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
};

exports.checkSessionCount = (req, res, next) => {
  if (req.user.sessionCount < 3) {
    return next();
  }
  res.status(400);
  return res.json({ message: "Account is being used in more than 2 devices" });
};

exports.mustBeApproved = (req, res, next) => {
  if (req.user.isApproved) {
    next();
    return;
  }
  res.status(403).json({ message: "You are not approved to access this page" });
};

exports.checkSubscriptionStatus = (req, res, next) => {
  if (!req.user.isSubscriptionExpired) {
    next();
    return;
  }
  res.status(403).json({
    message: "Your subscription has expired, UPGRADE your account.",
  });
};

exports.authRole = (role) => (req, res, next) => {
  if (req.user.roles.includes(role)) {
    return next();
  }
  res.status(403);
  return res.json({ message: "This route is restricted to admin(s) only" });
};
