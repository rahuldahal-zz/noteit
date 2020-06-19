const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const notesController = require("../controllers/notesController");


router.get("/:faculty/:semester/:subject/:unit",
    userController.mustBeLoggedIn,
    userController.checkSubscriptionStatus,
    userController.mustBeApproved,
    notesController.checkForCorrectSubscription,
    notesController.findSavedNotes,
    notesController.hasUserSavedThisNote,
    notesController.viewParticularUnit);


router.post("/create", notesController.createNewNote);
router.post("/save",
    notesController.findSavedNotes,
    notesController.hasUserSavedThisNote,
    notesController.saveNotes);
router.post("/search", userController.mustBeLoggedIn, userController.mustBeApproved, notesController.handleSearch);

module.exports = router //exports "router" to the app.js

