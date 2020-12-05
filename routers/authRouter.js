const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/User");

// logout

router.get("/logout", (req, res) => {
  console.log("logging out");
  User.prototype
    .sessionCountHandler(req.user._id, "decrement")
    .then(() => req.session.destroy())
    .catch((err) => console.log("from logout: " + err));
  res.status(300).redirect("/");
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

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/fail",
  })
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/auth/fail",
  })
);

module.exports = router;
