const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");

router.get(
  "/",
  userController.mustBeLoggedIn,
  userController.authRole("admin"),
  adminController.home
);
router.post(
  "/login",
  userController.mustBeLoggedIn,
  userController.authRole("admin"),
  adminController.login
);

module.exports = router; //exports "router" to the app.js
