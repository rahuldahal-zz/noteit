const express = require("express");
const router = express.Router();
const {
  mustBeApproved,
  mustBeLoggedIn,
  saveFacultyAndSemester,
} = require("../controllers/userController");

const {
  sendNotesDescriptionToClient,
} = require("../controllers/notesController");

const mustHaveToken = require("../controllers/middlewares/mustHaveToken");

router.get(
  "/availableNotes",
  mustBeLoggedIn,
  mustBeApproved,
  sendNotesDescriptionToClient
);

router.get("/protected", mustHaveToken, (req, res) =>
  res.json({ message: "go to the controller" })
);

router.post("/saveFacultyAndSemester", mustHaveToken, saveFacultyAndSemester);

module.exports = router;
