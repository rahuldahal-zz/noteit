const User = require("../models/User");
const reusable = require("./reusableFunctions");

exports.doesUsernameExist = (req, res) => {
  User.findByUsername(req.body.username)
    .then(() => res.json(true))
    .catch(() => res.json(false));
};
exports.doesEmailExist = (req, res) => {
  console.log(req.body.email);
  User.findByEmail(req.body.email)
    .then(() => res.json(true))
    .catch(() => res.json(false));
};

exports.root = (req, res) => {
  if (!req.user) return res.render("home-guest");

  if (!req.user.faculty || !req.user.semester) {
    return res.render("saveFacultyAndSemester");
  }
  if (!req.session.canViewHomePage) {
    return res.render("notes/readyToGo");
  }

  return res.redirect(303, "/home");
};

exports.saveFacultyAndSemester = (req, res, next) => {
  let user = new User(req.user);
  user
    .saveFacultyAndSemester(req.body.faculty, req.body.semester)
    .then(() =>
      res
        .status("200")
        .json({ message: "Faculty and Semester Saved Successfully." })
    )
    .catch((error) => reusable.respond(400, error, res));
};

exports.home = (req, res) => {
  /**
   * when this controller fires, set a "cookie" to signify that the "user" has been to this route before,
   * which means they have "availableNotes" on their local storage and we are safe to render the "welcome" view
   **/

  // set cookie, using express' express-session
  req.session.canViewHomePage = true;

  if (req.user.faculty && req.user.semester) {
    res.render("notes/welcome");

    // if not approved, log them out after 30 seconds

    if (!req.user.isApproved) {
      setTimeout(() => req.logout, 30000);
      return;
    }
  }
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.user && req.user.faculty && req.user.semester) {
    next();
    return;
  } else {
    reusable.sendFlashMessage(
      req,
      res,
      "errors",
      "You must be logged in to perform that action",
      "/"
    );
  }
};

exports.checkSessionCount = (req, res, next) => {
  if (req.user.sessionCount < 3) {
    console.log("less than 3 sessions...");
    return next();
  }
  reusable.respond(429, "Account is being used in more than 2 devices", res);
};

exports.mustBeApproved = (req, res, next) => {
  if (req.user.isApproved) {
    next();
    return;
  } else reusable.respond(403, "You are not approved to access this page", res);
};

exports.checkSubscriptionStatus = (req, res, next) => {
  if (!req.user.isSubscriptionExpired) {
    next();
    return;
  } else
    reusable.respond(
      403,
      "Your subscription has expired, UPGRADE your account.",
      res
    );
};

exports.authRole = (role) => {
  return (req, res, next) => {
    console.log(`Authenticating for ${role}`);
    if (req.user.roles.includes(role)) {
      req.admin = req.user.firstName;
      return next();
    } else {
      reusable.sendFlashMessage(
        req,
        res,
        "errors",
        "You do not have the permission to access this page.",
        "/"
      );
    }
  };
};
