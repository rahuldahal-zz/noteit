const router = require("express").Router();
const {
  login,
  getAllNotes,
  createNote,
} = require("@controllers/adminController");
const { authRole } = require("@controllers/userController");
const {
  mustHaveUserToken,
  mustHaveAdminToken,
} = require("@controllers/middlewares/mustHaveToken");

router.post("/login", mustHaveUserToken, authRole("admin"), login);

// notes

router.get("/notes", mustHaveAdminToken, getAllNotes);

router.post("/notes/create", mustHaveAdminToken, createNote);

module.exports = router;
