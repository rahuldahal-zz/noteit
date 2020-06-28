const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");


// logout

router.post("/logout", (req, res) => {
    console.log("logging out");
    req.logout();
    res.status(300).redirect("/");
})

// authentication

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

router.get("/facebook", passport.authenticate("facebook", {
    scope: ["profile", "email"]
}))


// redirect route

// why fire passport.authenticate again ?
// cause the first time, it was used to go-to the "consent-screen" and receive "permission" to access user's profile
// after user has allowed, the service provider sends a code, using it we can access the user's profile
// this is what the second "invocation" will do, essentially firing the "passport-callback" from "passportController"

router.get("/google/redirect",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/auth/fail"
    })

);

router.get("/facebook/redirect",
    passport.authenticate("facebook"),
    (req, res) => {
        console.log("all done, will be redirected to root");
    }
);


module.exports = router;