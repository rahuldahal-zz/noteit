const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const notesController = require("../controllers/notesController");

router.post("/sendNotesToClient", notesController.sendNotesDescriptionToClient);

router.post("/saveFacultyAndSemester", userController.saveFacultyAndSemester);

module.exports = router; //exports "router" to the app.js
