const router = require("express").Router();
const contributorsController = require("../controllers/contributorsController");
const adminController = require("../controllers/adminController");
const cors = require("cors");

// restricting CORS to only specified domain

const whiteListDomains = [process.env.ALLOWED_ORIGIN_EDITOR];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteListDomains.indexOf(origin) !== -1 || !origin) {
      // the !origin allows tools like "postman" to send the request
      callback(null, true); // yes, they are allowed
    } else {
      callback(new Error("Not allowed by express-CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

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
  "/admin/contributors/approve",
  adminController.mustHaveToken,
  adminController.approveContributor
);

router.put(
  "/admin/users/disapprove",
  adminController.mustHaveToken,
  adminController.disapproveUser
);

router.put(
  "/admin/contributor/disapprove",
  adminController.mustHaveToken,
  adminController.disapproveContributor
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
router.post(
  "/contributors/submitNote",
  adminController.mustHaveToken,
  contributorsController.createNoteFileAndMail
);
router.get("/contributors", contributorsController.getAll);

module.exports = router;
