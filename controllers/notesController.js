const User = require("../models/User");
const Notes = require("../models/Notes");
const GenerateView = require("./generateView");

const { sendFlashMessage } = require("./utils/respond");

exports.checkForCorrectSubscription = (req, res, next) => {
  if (
    req.user.faculty === req.params.faculty &&
    req.user.semester === req.params.semester
  ) {
    /**
     * notes can be searched(on later middleware) in two ways,
     * 1. toViewParticularUnit -> search basedOn "title"
     * 2. toSaveParticularUnit -> search basedOn "objectID"
     * on both conditions, we need to check if the "requested" note even exists
     */
    req.toViewParticularUnit = true; // will be used in hasUserSavedThisNote()
    next(); // findSavedNotes()
    return;
  }
  return sendFlashMessage({
    collection: "errors",
    message: "You do not have correct subscription to access this resource.",
    redirectURL: "/home",
  });
};

exports.findSavedNotes = (req, res, next) => {
  // if (req.hasVisitorContributedThatNote) {
  //     next();
  //     return;
  // }
  let user = new User(req.user);
  user
    .findSavedNotes()
    .then((savedNotes) => {
      req.savedNotesByUser = savedNotes;

      //setting savedNotes to "locals" so that all templates could use it
      res.locals.savedNotes = savedNotes;
      next(); // hasUserSavedThisNote();
    })
    .catch((error) => {
      reusable.sendFlashMessage({
        collection: "errors",
        message: error,
        redirectURL: "/",
      });
    });
};

exports.hasUserSavedThisNote = (req, res, next) => {
  if (req.hasVisitorContributedThatNote) {
    next();
    return;
  }

  //check if the requested "note" even exists
  const note = new Notes(req.user);

  let basedOn, value;

  if (req.toViewParticularUnit) {
    (basedOn = "title"), (value = req.params.unit);
  } else {
    (basedOn = "id"), (value = req.params.noteId);
  }

  note
    .findRequestedNote(basedOn, value)
    .then((response) => {
      req.requestedNote = {}; //initializing an empty object before using it.
      console.log("find requested note resolves...");
      req.requestedNote = response; //findRequestedNote resolves with the "note" itself
      req.requestedNote.hasSaved = false;
      //must convert "_id" to string for comparison
      for (let i = 0; i < req.savedNotesByUser.length; i++) {
        if (
          req.savedNotesByUser[i].toString() == req.requestedNote._id.toString()
        ) {
          req.requestedNote.hasSaved = true;
          break;
        }
      }

      next(); // viewParticularUnit()
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
      res.renderTemplate("index", { toRender: "404" });
    });
};

exports.viewParticularUnit = (req, res) => {
  const rawNote = JSON.parse(JSON.parse(req.requestedNote.note)); // the "note" property of notesCollection, contains "string" inside a "string". So, we need to parse it twice.
  const generateView = new GenerateView(rawNote.blocks);
  generateView
    .then((content) =>
      res.renderTemplate("index", {
        toRender: "notes/genericNote",
        data: {
          content,
          requestedNote: req.requestedNote,
          hasVisitorContributedThatNote: req.hasVisitorContributedThatNote,
        },
      })
    )
    .catch((error) => res.send(error));
};

exports.saveNotes = (req, res) => {
  let user = new User(req.user);

  //if "note" is not saved already, then save it, else remove
  if (!req.requestedNote.hasSaved) {
    user
      .saveNotes(req.params.noteId)
      .then(() => {
        console.log("Saved...", req.body.noteId);
        return res.status(200).json({ message: "Note is saved successfully!" });
      })
      .catch((error) => {
        return reusable.sendFlashMessage({
          collection: "errors",
          message: error,
          redirectURL: "/",
        });
      });
  } else {
    user
      .removeSaved(req.params.noteId)
      .then(() => {
        console.log("Removed ?");
        return res
          .status(200)
          .json({ message: "Note is removed successfully!" });
      })
      .catch((error) => {
        return reusable.sendFlashMessage({
          collection: "errors",
          message: error,
          redirectURL: "/",
        });
      });
  }
};

exports.sendNotesDescriptionToClient = (req, res, next) => {
  //finding notes from the db
  let notes = new Notes(req.user);
  // if (!req.hasNotesInLocalStorage) {
  notes
    .findNotes(req.user.faculty, req.user.semester)
    .then((availableNotes) => {
      res.status(200).json(availableNotes); //use this in the front end to render subjects and their units, also store in localStorage
      return;
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.handleSearch = (req, res) => {
  Notes.search(req.params.searchTerm, req.user.faculty, req.user.semester)
    .then((response) => res.json(response))
    .catch((error) => res.json([]));
};
