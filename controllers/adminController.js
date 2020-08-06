const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");
const reusable = require("./reusableFunctions");

dotenv.config();

exports.home = (req, res) => {
  res.render("admin/adminLoginPage", { admin: req.admin });
};

exports.login = (req, res) => {
  if (
    req.body.username === process.env.ADMINUSERNAME &&
    req.body.password === process.env.ADMINPASSWORD
  ) {
    res.render("admin/dashboard", {
      jwt: jwt.sign({ adminName: req.body.adminName }, process.env.JWTSECRET, {
        expiresIn: "30m",
      }),
    });
    // res.render("admin/dashboard");
  } else {
    res.redirect("/");
  }
};

exports.mustHaveToken = function (req, res, next) {
  try {
    if (req.method === "GET") {
      console.log(req.headers);
      const payload = jwt.verify(req.headers.token, process.env.JWTSECRET);
      console.log(payload.admin);
      return next();
    }

    const payload = jwt.verify(req.body.token, process.env.JWTSECRET);
    console.log(payload.admin);
    return next();
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
  Admin.getAllContributors()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.getAllNotes = (req, res) => {
  Admin.getAllNotes()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.createNote = (req, res) => {
  Admin.createNote(req.body)
    .then((response) => res.status(201).json(response))
    .catch((error) => res.status(500).json({ message: error }));
};
