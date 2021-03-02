const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const contributorsController = require("../controllers/contributorsController");
const followController = require("../controllers/followController");

router.get(
  "/contributor-screen",
  userController.mustBeLoggedIn,
  userController.checkSessionCount,
  contributorsController.showContributorScreen
);

router.get(
  "/:username",
  userController.mustBeLoggedIn,
  userController.checkSessionCount,
  contributorsController.getOne
);
router.post(
  "/editContacts",
  userController.mustBeLoggedIn,
  userController.checkSessionCount,
  contributorsController.editContacts
);

//follow actions
router.post(
  "/addFollow/:contributorId",
  userController.mustBeLoggedIn,
  userController.checkSessionCount,
  followController.addFollow
);
router.post(
  "/removeFollow/:contributorId",
  userController.mustBeLoggedIn,
  userController.checkSessionCount,
  followController.removeFollow
);

module.exports = router; //exports "router" to the app.js
