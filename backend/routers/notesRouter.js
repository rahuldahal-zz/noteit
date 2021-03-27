const router = require("express").Router();
const { saveNote, removeSaved } = require("@controllers/notesController");
const { mustHaveUserToken } = require("@controllers/middlewares/mustHaveToken");

router.get("/save/:noteId", mustHaveUserToken, saveNote);

router.get("/removeSaved/:noteId", mustHaveUserToken, removeSaved);

module.exports = router;
