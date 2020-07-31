const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const contributorsController = require("../controllers/contributorsController");

router.get("/", adminController.home);
router.get("/getContributors", adminController.sendContributors);
router.post("/", adminController.login);
router.post("/userQuery", adminController.sendUsers);
router.post("/approve-single", adminController.approveSingle);
router.post("/disapprove-single", adminController.disapproveSingle);
router.post(
  "/removeAsContributor",
  adminController.removeAsContributor,
  contributorsController.remove
);

//this route must be the last route...
router.post("/:action", adminController.controlAction);

module.exports = router; //exports "router" to the app.js
