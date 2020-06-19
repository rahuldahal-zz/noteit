const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const contributorsController = require("../controllers/contributorsController");
const followController = require("../controllers/followController");

router.get("/contributor-screen", userController.mustBeLoggedIn, userController.authRole("contributor"), contributorsController.showContributorScreen);
router.get("", contributorsController.getAll);
router.get("/:username", userController.mustBeLoggedIn, contributorsController.getOne);
router.post("/editContacts", userController.mustBeLoggedIn, contributorsController.editContacts);

//follow actions
router.post("/addFollow/:contributorId", userController.mustBeLoggedIn, followController.addFollow);
router.post("/removeFollow/:contributorId", userController.mustBeLoggedIn, followController.removeFollow);


module.exports = router //exports "router" to the app.js
