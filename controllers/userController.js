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
    if (req.user) {
        res.redirect(303, "/home");
    }

    else
        res.render("home-guest");
}

exports.home = (req, res) => {
    if (req.user.faculty && req.user.semester) {
        res.render(`notes/welcome`);
    }
    else {
        res.render("chooseFacultyAndSemester");
    }
}

exports.register = (req, res, next) => {
    let user = new User(req.body);
    user.register()
        .then((registeredUser) => {
            req.user = registeredUser;
            next();
            return;
        })
        .catch(() => res.status(500).end());
}

exports.createSession = (req, res) => {

    //creating the session for the user
    req.session.user = {
        _id: req.user._id,
        username: req.user.username,
        faculty: req.user.faculty,
        semester: req.user.semester,
        roles: req.user.roles,
        isApproved: req.user.isApproved,
        isSubscriptionExpired: req.user.isSubscriptionExpired,
        savedNotes: req.user.savedNotes
    };
    req.session.save(() => {
        //finding the currently created session and appending the "userId" property
        sessionCollection.findOneAndUpdate({ _id: req.sessionID }, { $set: { userId: req.session.user._id } })
            .then((requiredSession) => {
                //sending the "notes" summary to the client for storing in local storage
                res.status(202).json(req.notes);
            })
            .catch((err) => {
                res.status(500);

                res.render("home-guest");
            });
    })
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



exports.login = (req, res, next) => {
    let user = new User(req.body);
    user.login()
        .then((response) => {
            req.user = response;
            req.hasNotesInLocalStorage = req.body.hasNotesInLocalStorage;
            console.log(response);
            next(); //notesController.sendNotesDescription
            return;
        })
        .catch((err) => {
            res.send(err);
        })
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
