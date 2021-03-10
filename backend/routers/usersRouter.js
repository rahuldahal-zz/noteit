const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const notesController = require("../controllers/notesController");

router.get(
  "/availableNotes",
  userController.mustBeLoggedIn,
  userController.mustBeApproved,
  notesController.sendNotesDescriptionToClient
);

router.post("/create", (req, res) => {
  const { firstName, lastName, picture, id, email } = req.body;
  res.status(202).json({ message: id });
});

router.post("/saveFacultyAndSemester", userController.saveFacultyAndSemester);

module.exports = router; //exports "router" to the app.js
