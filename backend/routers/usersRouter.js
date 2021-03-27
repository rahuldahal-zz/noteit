const router = require("express").Router();
const { saveFacultyAndSemester } = require("@controllers/userController");

const {
  sendNotesDescriptionToClient,
} = require("@controllers/notesController");

const { mustHaveUserToken } = require("@controllers/middlewares/mustHaveToken");

router.get("/availableNotes", mustHaveUserToken, sendNotesDescriptionToClient);

router.post(
  "/saveFacultyAndSemester",
  mustHaveUserToken,
  saveFacultyAndSemester
);

module.exports = router;
