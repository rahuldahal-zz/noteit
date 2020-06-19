const User = require("../models/User");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");
dotenv.config();

exports.home = (req, res) => {
    res.render("admin/adminLoginPage");
}

exports.controlAction = (req, res) => {
    if (req.params.action === "searchUser") {
        res.render("admin/searchUser-dashboard");
    }
    if (req.params.action === "createNote") {
        res.render("admin/createNote-dashboard");
    }
}

exports.login = (req, res) => {
    if (req.body.username === process.env.ADMINUSERNAME && req.body.password === process.env.ADMINPASSWORD) {
        res.render("admin/dashboard");
    }
    else {
        res.redirect("/");
    }
}

exports.sendUsers = (req, res) => {
    let searchTerm = req.body.searchTerm;
    let basedOn = req.body.basedOn;

    Admin.handleSearch(searchTerm, basedOn)
        .then((user) => {
            console.log(user);
            res.json(user);
        })
        .catch((error) => {
            res.send(error);
        })
}

exports.sendContributors = (req, res) => {
    User.findByRole("contributor")
        .then((response) => res.status(200).json(response))
        .catch((error) => console.log(error));
}

exports.approveSingle = (req, res) => {
    Admin.findAndApproveOne(req.body.userId)
        .then((response) => {
            res.redirect(200, "/admin");
        })
        .catch((error) => {
            res.send(error);
        })
}
exports.disapproveSingle = (req, res) => {
    console.log("runs", req.body.userId);
    Admin.findAndDisapproveOne(req.body.userId)
        .then((response) => {
            console.log(response);
            res.redirect("/admin");
        })
        .catch((error) => {
            res.send(error);
        })
}

exports.makeContributor = (req, res, next) => {
    Admin.findAndMakeContributor(req.body.userId)
        .then((response) => {
            req.recentlyAddedContributor = response;
            next();
            return;
        })
        .catch((error) => res.send(error));
}
exports.removeAsContributor = (req, res, next) => {
    Admin.findAndRemoveContributor(req.body.userId)
        .then((response) => {
            req.recentlyRemovedContributor = response;
            next();
            return;
        })
        .catch((error) => res.send(error));
}