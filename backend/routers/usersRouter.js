const express = require("express");
const router = express.Router();
const {
  create,
  mustBeApproved,
  mustBeLoggedIn,
  saveFacultyAndSemester,
} = require("../controllers/userController");
const {
  sendNotesDescriptionToClient,
} = require("../controllers/notesController");

router.get(
  "/availableNotes",
  mustBeLoggedIn,
  mustBeApproved,
  sendNotesDescriptionToClient
);

router.post("/create", create);

router.post("/saveFacultyAndSemester", saveFacultyAndSemester);

module.exports = router; //exports "router" to the app.js
