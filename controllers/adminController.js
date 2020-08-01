const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");
const reusable = require("./reusableFunctions");
const Contributors = require("../models/Contributors");

dotenv.config();

exports.home = (req, res) => {
  res.render("admin/adminLoginPage");
};

exports.login = (req, res) => {
  if (
    req.body.username === process.env.ADMINUSERNAME &&
    req.body.password === process.env.ADMINPASSWORD
  ) {
    res.status(200).json(
      jwt.sign({ authorized: "yesss" }, process.env.JWTSECRET, {
        expiresIn: "30m",
      })
    );
    // res.render("admin/dashboard");
  } else {
    res.redirect("/");
  }
};

exports.mustHaveToken = function (req, res, next) {
  try {
    const payload = jwt.verify(req.body.token, process.env.JWTSECRET);
    console.log(payload);
    next();
  } catch (error) {
    reusable.throwError(400, "You must provide a valid token", res);
  }
};

exports.sendUsers = (req, res) => {
  let searchTerm = req.body.searchTerm;
  let basedOn = req.body.basedOn;

  Admin.handleSearch(searchTerm, basedOn)
    .then((user) => {
      console.log("Sending user query");
      res.json(user);
    })
    .catch((error) => {
      res.send(error);
    });
};

exports.approveSingle = (req, res) => {
  Admin.findAndApproveOne(req.body.userId)
    .then((response) => res.status(202).json({ message: response }))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.disapproveSingle = (req, res) => {
  Admin.findAndDisapproveOne(req.body.userId)
    .then((response) => res.status(202).json({ message: response }))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.removeAsContributor = (req, res, next) => {
  Admin.findAndRemoveContributor(req.body.userId)
    .then((response) => {
      req.recentlyRemovedContributor = response;
      next();
      return;
    })
    .catch((error) => res.send(error));
};

exports.getAllContributors = (req, res) => {
  Contributors.getAllForAdmin()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(500).json({ message: error }));
};
