const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/User");
const { server } = require("../utils/getServer");
const getSubObject = require("../utils/getSubObject");
const { signToken } = require("../utils/jwtConfig");

router.get("/logout", (req, res) => {
  console.log("logging out");
  User.prototype
    .sessionCountHandler(req.user._id, "decrement")
    .then(() => {
      req.session = null;
      req.user = null;
    })
    .catch((err) => console.log("from logout: " + err));
  res.status(300).redirect(`${server}/`);
});

// authentication

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/facebook", passport.authenticate("facebook"));

// redirect route

// why fire passport.authenticate again ?
// cause the first time, it was used to go-to the "consent-screen" and receive "permission" to access user's profile
// after user has allowed, the service provider sends a code, using it we can access the user's profile
// this is what the second "invocation" will do, essentially firing the "passport-callback" from "passportController"

router.get("/google/redirect", passport.authenticate("google"), (req, res) =>
  res.redirect(`${server}/home`)
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => res.redirect(`${server}/home`)
);

router.get("/getToken", (req, res) => {
  if (req.user) {
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
    const signedToken = signToken(payload);

    return res.status(200).json({ token: signedToken });
  }
  return res.status(401).json({ message: "Not Authenticated" });
});

module.exports = router;
