const router = require("express").Router();
const contributorsController = require("../controllers/contributorsController");
const adminController = require("../controllers/adminController");
const cors = require("cors");
const corsOptions = require("./utils/corsConfig");

router.use(cors(corsOptions));

/**
 * Admin API
 */

// users

router.post(
  "/admin/users",
  adminController.mustHaveToken,
  adminController.sendUsers
);

router.put(
  "/admin/users/approve",
  adminController.mustHaveToken,
  adminController.approveUser
);

router.put(
  "/admin/users/disapprove",
  adminController.mustHaveToken,
  adminController.disapproveUser
);

/**
 * used "post" just to "securely" send JWT via the "req.body",
 * rather than "req.headers"
 */

router.post(
  "/admin/contributors",
  adminController.mustHaveToken,
  adminController.getAllContributors
);

// notes

router.post(
  "/admin/notes",
  adminController.mustHaveToken,
  adminController.getAllNotes
);

router.post(
  "/admin/notes/create",
  adminController.mustHaveToken,
  adminController.createNote
);

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
  adminController.mustHaveToken,
  adminController.approveContributor
);

router.put(
  "/admin/contributor/disapprove",
  adminController.mustHaveToken,
  adminController.disapproveContributor
);
router.post(
  "/contributors/submitNote",
  adminController.mustHaveToken,
  contributorsController.createNoteFileAndMail
);

router.get("/contributors", contributorsController.getAll);

module.exports = router;
