const router = require("express").Router();
const contributorsController = require("../controllers/contributorsController");
const adminController = require("../controllers/adminController");
const cors = require("cors");
const corsOptions = require("./utils/corsConfig");
const mustHaveToken = require("../controllers/middlewares/mustHaveToken");

router.use(cors(corsOptions));

/**
 * Admin API
 */

// users

router.post("/admin/users", mustHaveToken, adminController.sendUsers);

router.put("/admin/users/approve", mustHaveToken, adminController.approveUser);

router.put(
  "/admin/users/disapprove",
  mustHaveToken,
  adminController.disapproveUser
);

/**
 * used "post" just to "securely" send JWT via the "req.body",
 * rather than "req.headers"
 */

router.post(
  "/admin/contributors",
  mustHaveToken,
  adminController.getAllContributors
);

// notes

router.post("/admin/notes", mustHaveToken, adminController.getAllNotes);

router.post("/admin/notes/create", mustHaveToken, adminController.createNote);

/**
 * Contributors' API
 */

router.post(
  "/contributors/create",
  contributorsController.isContributorAlreadyRegistered,
  contributorsController.create
);

router.put(
  "/admin/contributors/approve",
  mustHaveToken,
  adminController.approveContributor
);

router.put(
  "/admin/contributor/disapprove",
  mustHaveToken,
  adminController.disapproveContributor
);
router.post(
  "/contributors/submitNote",
  mustHaveToken,
  contributorsController.createNoteFileAndMail
);

router.get("/contributors", contributorsController.getAll);

module.exports = router;
