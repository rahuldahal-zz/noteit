const User = require("../models/User");
const Notes = require("../models/Notes");

exports.checkForCorrectSubscription = (req, res, next) => {
    function checkFacultyAndSemester() {
        if (req.user.faculty === req.params.faculty &&
            req.user.semester === req.params.semester) {
            next();
            return;
        }
        req.flash("errors", "You do not have the correct subscription to access this page.");
        req.save(() => {
            res.redirect("/home");
        })
    }

    //if "visitor" is not a "contributor", check the subscription details...
    if (!req.user.roles.includes("contributor")) {
        checkFacultyAndSemester();
    }
    else {
        Notes.hasVisitorContributedThatNote(req.params.unit, req.user._id)
            .then((response) => {
                if (response) {
                    req.hasVisitorContributedThatNote = true;
                    next();
                    return;
                };
            })
            .catch((rejectMessage) => {
                //if rejects with "false", means that the "visitor" is not the "contributor", so check the "subscription"
                if (!rejectMessage) {
                    checkFacultyAndSemester();
                    return;
                }
                //if rejects with "message", means that the "note" was not found in database, show "flash" "notfound" message
                req.flash("errors", rejectMessage);
                req.save(() => {
                    res.redirect("/home");
                })
            });
    }


}

exports.findSavedNotes = (req, res, next) => {
    // if (req.hasVisitorContributedThatNote) {
    //     next();
    //     return;
    // }
    let user = new User(req.user);
    user.findSavedNotes()
        .then((savedNotes) => {
            req.savedNotesByUser = savedNotes;

            //setting savedNotes to "locals" so that all templates could use it
            res.locals.savedNotes = savedNotes;

            next();
        })
        .catch((error) => console.log(error));
}

exports.hasUserSavedThisNote = (req, res, next) => {
    if (req.hasVisitorContributedThatNote) {
        next();
        return;
    }

    //check if the requested "note" even exists
    const note = new Notes(req.user);

    //if "_id" is on the body(like, post request), use "basedOn: id", else use "basedOn: title"(get request);
    let basedOn, value;
    if (req.method == "GET") {
        basedOn = "title";
        value = req.params.unit
    }
    else if (req.method == "POST") {
        basedOn = "id";
        value = req.body.noteId;
    }
    note.findRequestedNote(basedOn, value)
        .then((response) => {
            req.requestedNote = {}; //initializing an empty object before using it.
            req.requestedNote._id = response._id; //findRequestedNote resolves with the "note" itself
            req.requestedNote.hasSaved = false;
            //must convert "_id" to string for comparison
            for (let i = 0; i < req.savedNotesByUser.length; i++) {
                if (req.savedNotesByUser[i].toString() == req.requestedNote._id.toString()) {
                    req.requestedNote.hasSaved = true;
                    break;
                }
            }
            next();
        })
        .catch((err) => res.render("404"));
}

exports.viewParticularUnit = (req, res) => {
    res.render(`notes/${req.params.faculty}/${req.params.semester}/${req.params.subject}/${req.params.unit}`,
        {
            requestedNote: req.requestedNote,
            hasVisitorContributedThatNote: req.hasVisitorContributedThatNote
        });
}

exports.saveNotes = (req, res) => {
    let user = new User(req.user);

    //if "note" is not saved already, then save it, else remove
    if (!req.requestedNote.hasSaved) {

        user.saveNotes(req.body.noteId)
            .then(() => {
                res.status(200).send("saved successfully");
            })
            .catch((error) => console.log(error));
    }
    else {
        user.removeSaved(req.body.noteId)
            .then(() => {
                res.status(200).send("Removed successfully");
            })
            .catch((error) => console.log(error));
    }
}

exports.createNewNote = (req, res) => {
    let note = new Notes(req.body);
    note.createNewNote()
        .then((response) => {
            req.send(response).end();
        })
        .catch((error) => res.send(error));
}

exports.sendNotesDescriptionToClient = (req, res, next) => {

    //finding notes from the db
    let notes = new Notes(req.user);
    if (!req.hasNotesInLocalStorage) {
        notes.findNotes(req.user.faculty, req.user.semester)
            .then((availableNotes) => {
                req.notes = availableNotes; //use this in the front end to render subjects and their units, also store in localStorage, this is send in JSON via the next();
                next();
                return;
            })
            .catch((error) => console.log(error));
    }
    else {
        req.notes = {};
        next();
    }

}

exports.handleSearch = (req, res) => {
    Notes.search(req.body.searchTerm, req.session.user.faculty, req.session.user.semester)
        .then((response) => res.json(response))
        .catch((error) => res.json([]));
}