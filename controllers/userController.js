const User = require("../models/User");
const reusable = require("./reusableFunctions");

exports.doesUsernameExist = (req, res) => {
    User.findByUsername(req.body.username)
        .then(() => res.json(true))
        .catch(() => res.json(false))
}
exports.doesEmailExist = (req, res) => {
    console.log(req.body.email);
    User.findByEmail(req.body.email)
        .then(() => res.json(true))
        .catch(() => res.json(false))
}

exports.root = (req, res) => {

    // if authenticated, redirect to "home" page

    if (req.user) { res.redirect(303, "/home"); }
    else { res.render("home-guest"); }

}



/**
 * will either render the "chooseFacultyAndSemester" view
 * or, call the next middle-ware, depending upon the "authenticated" user
 */

exports.home = (req, res, next) => {

    if (!req.user.faculty || !req.user.semester) {
        res.render("chooseFacultyAndSemester");
    }
    else {
        return next(); // notesController.findSavedNotes
    }
}


exports.mustBeLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
        return;
    }

    else {
        reusable.throwError(401, "You must be logged in to perform that action", next);
    }
}



exports.mustBeApproved = (req, res, next) => {
    if (req.session.user.isApproved) {
        next();
        return;
    }
    else
        req.flash("errors", "You are not approved to access this page");
    req.session.save(() => {
        res.redirect("/home");
    })
}
exports.checkSubscriptionStatus = (req, res, next) => {
    if (!req.session.user.isSubscriptionExpired) {
        next();
        return;
    }
    else
        req.flash("errors", "Your subscription has expired, UPGRADE your account.");
    req.session.save(() => {
        res.redirect("/home");
    })
}

exports.authRole = (role) => {
    return (req, res, next) => {
        if (req.session.user.roles.includes(role)) {
            next();
            return;
        }

        else {
            res.status("403");
            req.flash("errors", "You do not have the permission to access this page.");
            req.session.save(() => {
                res.redirect("/home");
            })
        }
    }
}
