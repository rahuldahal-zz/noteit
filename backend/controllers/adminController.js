const jwt = require("jsonwebtoken");
const { Admin } = require("../models/Admin");
const dotenv = require("dotenv");
const { signToken } = require("../utils/jwtConfig");

dotenv.config();

exports.login = (req, res) => {
  if (
    req.body.username === process.env.ADMIN_USERNAME &&
    req.body.password === process.env.ADMIN_PASSWORD
  ) {
    const payload = { admin: req.user._id };
    const token = signToken({ payload, admin: true });
    return res.status(202).json({ token });
  } else {
    return res.status(401).end();
  }
};

exports.mustHaveToken = function (req, res, next) {
  try {
    if (req.method === "GET") {
      const token = req.headers["authorization"].split(" ")[1];
      console.log(token);
      const payload = jwt.verify(token, process.env.JWTSECRET);
      console.log(payload);
      return next();
    }

    const payload = jwt.verify(req.body.token, process.env.JWTSECRET);
    console.log(payload);
    // making the payload available for the next middleware
    req.payload = payload;
    return next();
  } catch (error) {
    res.status(403).json({ message: "You must provide a valid token" });
  }
};

exports.sendUsers = (req, res) => {
  let searchTerm = req.body.searchTerm;
  let basedOn = req.body.basedOn;

  Admin.prototype
    .handleSearch(searchTerm, basedOn)
    .then((users) => {
      console.log("Sending user query");
      res.status(200).json({ users });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.approveUser = (req, res) => {
  const { userId } = req.body;
  Admin.prototype
    .handleUserApproval({
      userId,
    })
    .then((response) =>
      res.status(202).json({ message: "Approved Successfully" })
    )
    .catch((error) => console.log(error));
};

exports.approveContributor = (req, res) => {
  const { contributorId } = req.body;
  Admin.prototype
    .handleContributorApproval({
      contributorId,
    })
    .then((response) =>
      res.status(202).json({ message: "Approved Successfully" })
    )
    .catch((error) => res.status(500).json({ message: error }));
};

exports.disapproveUser = (req, res) => {
  const { userId } = req.body;
  Admin.prototype
    .handleUserApproval({
      userId,
      action: "disapprove",
    })
    .then((response) =>
      res.status(202).json({ message: "Disapproved Successfully" })
    )
    .catch((error) => res.status(500).json({ message: error }));
};

exports.disapproveContributor = (req, res) => {
  const { contributorId } = req.body;
  Admin.prototype
    .handleContributorApproval({
      contributorId,
      action: "disapprove",
    })
    .then((response) =>
      res.status(202).json({ message: "Disapproved Successfully" })
    )
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
  Admin.prototype
    .getAllContributors()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.getAllNotes = (req, res) => {
  Admin.getAllNotes()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(500).json({ message: error }));
};

exports.createNote = (req, res) => {
  new Admin(req.body)
    .createNote()
    .then((message) => res.status(201).json(message))
    .catch((error) => res.status(400).json(error));
};
