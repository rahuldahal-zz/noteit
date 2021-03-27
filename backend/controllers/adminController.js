const jwt = require("jsonwebtoken");
const { Admin } = require("@models/Admin");
const dotenv = require("dotenv");
const { Contributor } = require("@models/Contributors");
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
  }
  return res.status(401).end();
};

exports.sendUsers = (req, res) => {
  const { searchTerm, basedOn } = req.body;

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

exports.createContributor = (req, res, next) => {
  const { userId } = req.body;
  const contributor = new Contributor({ userId });
  contributor
    .create()
    .then((createdContributor) => {
      req.createdContributor = createdContributor;
      return next();
    })
    .catch((error) => res.status(400).send(error));
};

exports.makeContributor = (req, res) => {
  Admin.prototype
    .findAndMakeContributor(req.body.userId)
    .then(() => {
      return res.status(201).json(req.createdContributor);
    })
    .catch((error) => res.send(error));
};

exports.removeAsContributor = (req, res, next) => {
  Admin.prototype
    .findAndRemoveContributor(req.body.userId)
    .then((response) => {
      req.recentlyRemovedContributor = response;
      return next();
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
  new Admin()
    .createNote(req.body)
    .then(() => res.status(201).json({ message: "Note created successfully" }))
    .catch((error) => res.status(400).json(error));
};
