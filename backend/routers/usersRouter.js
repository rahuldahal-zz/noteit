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

const {
  mustHaveUserToken,
} = require("../controllers/middlewares/mustHaveToken");

router.get(
  "/availableNotes",
  mustBeLoggedIn,
  mustBeApproved,
  sendNotesDescriptionToClient
);

router.get("/protected", mustHaveUserToken, (req, res) =>
  res.json({ message: "go to the controller" })
);

router.post(
  "/saveFacultyAndSemester",
  mustHaveUserToken,
  saveFacultyAndSemester
);

module.exports = router;
