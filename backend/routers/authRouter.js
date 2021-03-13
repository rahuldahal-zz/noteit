const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/User");
const { server } = require("../utils/getServer");

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
  passport.authenticate("google", (req, res) => res.redirect(`${server}/about`))
);

router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", (req, res) =>
    res.redirect(`${server}/about`)
  )
);

router.get("/getUser", (req, res) => {
  console.log("sending user data...");
  return res.status(200).json({ user: req.user });
});

module.exports = router;
