const User = require("../models/User");
const Contributors = require("../models/Contributors");
const Follow = require("../models/Follow");

exports.showContributorScreen = (req, res) => {
    res.render("contributors/contributor-screen");
}

exports.getAll = (req, res) => {
    User.findByRole("contributor")
        .then((response) => res.send(response))
        .catch((error) => res.send(error));
}

exports.getOne = (req, res) => {
    Contributors.getOne(req.params.username)
        .then((response) => {
            response.isVisitorTheRequestedContributor = false;
            if (req.user) {
                if (req.user._id.toString() === response.userId.toString())
                    response.isVisitorTheRequestedContributor = true;

                //check if the visitor is following the requested contributor

                Follow.isVisitorFollowing(response._id, req.user._id)
                    .then(() => {
                        response.isVisitorFollowing = true;
                        res.render("contributors/contributor-profile", { contributor: response });
                    })
                    .catch(() => {
                        response.isVisitorFollowing = false;
                        res.render("contributors/contributor-profile", { contributor: response });
                    })
            }

        })
        .catch((error) => {
            req.flash("errors", error);
            req.session.save(() => {
                if (req.session.user) res.redirect("/home");
                else res.redirect("/");
            })
        });
}

exports.add = (req, res) => {
    if (!req.recentlyAddedContributor) {
        res.status(500).send("inside contributorsController, 'req.recentlyAddedContributor' is undefined");
        return;
    }
    Contributors.addOne(req.recentlyAddedContributor)
        .then(() => res.send("success"))
        .catch((error) => console.log(error));
}

exports.remove = (req, res) => {
    if (!req.recentlyRemovedContributor) {
        res.status(500).send("inside contributorsController, 'req.recentlyRemovedContributor' is undefined");
        return;
    }
    Contributors.removeOne(req.recentlyRemovedContributor._id)
        .then(() => res.send("success"))
        .catch((error) => console.log(error));
}

exports.editContacts = (req, res) => {
    Contributors.editContacts(req.body)
        .then((editedProfile) => res.status(201).send(editedProfile))
        .catch((error) => res.send(error));
}


