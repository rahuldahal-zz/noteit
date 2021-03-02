const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const notesController = require("../controllers/notesController");

//user's-actions
router.get("/", userController.root);
router.get("/home", userController.mustBeLoggedIn, notesController.findSavedNotes, userController.home);


module.exports = router //exports "router" to the app.js