const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const notesController = require("../controllers/notesController");


router.post("/register", userController.register, notesController.sendNotesDescriptionToClient, userController.createSession);
router.post("/login", userController.login, notesController.sendNotesDescriptionToClient, userController.createSession);
router.post("/logout", userController.logout);

//developer's actions
router.post("/doesUsernameExist", userController.doesUsernameExist);
router.post("/doesEmailExist", userController.doesEmailExist);

module.exports = router //exports "router" to the app.js