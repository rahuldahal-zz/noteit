const router = require("express").Router();
const {
  saveFacultyAndSemester,
  saveNote,
  removeSaved,
} = require("@controllers/userController");

const {
  sendNotesDescriptionToClient,
} = require("@controllers/notesController");

const { mustHaveUserToken } = require("@controllers/middlewares/mustHaveToken");

router.post(
  "/saveFacultyAndSemester",
  mustHaveUserToken,
  saveFacultyAndSemester
);

router.get("/availableNotes", mustHaveUserToken, sendNotesDescriptionToClient);
router.put("/notes/save", mustHaveUserToken, saveNote);
router.put("/notes/removeSaved", mustHaveUserToken, removeSaved);

module.exports = router;
