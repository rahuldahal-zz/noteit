const { User } = require("@models/User");
const passport = require("passport");
const getSubObject = require("../utils/getSubObject");
const { signToken } = require("../utils/jwtConfig");
const { server } = require("../utils/getServer");

exports.root = (req, res) => {
  const responsePrototype = {
    isAuthenticated: false,
    isNewUser: false,
    token: null,
  };

  if (!req.user) {
    return res.status(401).json(responsePrototype);
  }

  // user is Authenticated
  console.log("sending user data...");
  const propertiesToReturn = [
    "_id",
    "email",
    "firstName",
    "lastName",
    "picture",
    "savedNotes",
  ];
  const payload = getSubObject(req.user, propertiesToReturn);
  const signedToken = signToken({ payload });
  responsePrototype.isAuthenticated = true;
  responsePrototype.token = signedToken;
  responsePrototype.isAdmin = req.user.roles.includes("admin");

  if (!req.user.faculty || !req.user.semester) {
    responsePrototype.isNewUser = true;
    return res.status(200).json(responsePrototype);
  }

  return res.status(200).json(responsePrototype);
};

exports.google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.facebook = passport.authenticate("facebook");

exports.callback = (req, res) => res.redirect(`${server}/`);

exports.logout = (req, res) => {
  console.log("logging out");
  User.prototype
    .sessionCountHandler(req.user._id, "decrement")
    .then(() => {
      req.logout();
      req.session = null;
      req.user = null;
      res.status(204).end();
    })
    .catch((err) => console.log("from logout: " + err));
};
