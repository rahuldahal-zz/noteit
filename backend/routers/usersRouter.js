const router = require("express").Router();
const {
  saveFacultyAndSemester,
  saveNote,
  removeSaved,
} = require("@controllers/userController");

const {
  sendNotesDescriptionToClient,
  searchNotes,
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
router.get("/notes/search", searchNotes);

module.exports = router;
