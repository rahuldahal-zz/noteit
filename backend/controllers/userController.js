const { User } = require("../models/User");
const { signToken } = require("../utils/jwtConfig");
const getSubObject = require("../utils/getSubObject");
const { sendFlashMessage } = require("./utils/respond");

// if exists already, then return existing; else create new

exports.create = async (req, res) => {
  const { id } = req.body;
  const OAuthProvider = id.split("|")[0];

  // cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.NODE_ENV === "production",
    expires: new Date(Date.now() + 8 * 3600000),
  };

  const user = new User(req.body, OAuthProvider);
  const propertiesToReturn = [
    "_id",
    "email",
    "firstName",
    "lastName",
    "picture",
    "savedNotes",
  ];
  try {
    const existingUser = await user.findBy({
      criteria: "OAuthId",
      value: id,
    });
    const payload = getSubObject(existingUser, propertiesToReturn);
    const signedToken = signToken(payload);

    return res
      .status(200)
      .cookie("token", signedToken, cookieOptions)
      .json({ token: signedToken });
  } catch (error) {
    if (error.reason === "noUser") {
      const newUser = await user.createUser();
      const payload = getSubObject(newUser, propertiesToReturn);
      const signedToken = signToken(payload);

      return res
        .status(201)
        .cookie("token", signedToken, cookieOptions)
        .json({ token: signedToken });
    }
  }
};

exports.root = (req, res) => {
  // const receivedTokenInCookie = req.cookies.token;
  return res.status(200).json({ cookie: req.cookies });
  // if (!req.user) return res.renderTemplate("index", { toRender: "home-guest" });
  if (!req.user) return res.json({ message: "No user, render guest screen" });

  if (!req.user.faculty || !req.user.semester) {
    // return res.renderTemplate("index", { toRender: "saveFacultyAndSemester" });
    return res.json({
      message: "No faculty and sem, render saveFacultyAndSem",
    });
  }

  // return res.redirect(303, "/home");
  return res.json({ message: "user is present, render home screen" });
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
    .catch((error) => res.status(400).json(error));
};

exports.home = (req, res) => {
  if (req.user.faculty && req.user.semester) {
    res.renderTemplate("index", { toRender: "notes/home" });

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
      if (role === "admin") {
        req.admin = req.user.firstName;
      }
      return next();
    } else {
      sendFlashMessage({
        collection: "errors",
        message: "You do not have the permission to access this page.",
        redirectURL: "/",
      });
    }
  };
};
