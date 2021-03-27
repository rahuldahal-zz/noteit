const { User } = require("@models/User");
const { Notes } = require("@models/Notes");

exports.sendNotesDescriptionToClient = (req, res) => {
  // finding notes from the db
  const notes = new Notes(req.user);
  // if (!req.hasNotesInLocalStorage) {
  notes
    .findNotes(req.user.faculty, req.user.semester)
    .then((availableNotes) => res.status(200).json(availableNotes))
    .catch((error) => res.status(400).json(error));
};

exports.saveNote = (req, res) => {
  const user = new User(req.user);
  user
    .saveNotesHandler({ noteId: req.params.noteId })
    .then(() => {
      console.log("Saved...", req.body.noteId);
      return res.status(200).json({ message: "Note is saved successfully!" });
    })
    .catch((error) => {
      console.log(error);
      return res.send(error);
    });
};

exports.removeSaved = (req, res) => {
  const user = new User(req.user);
  user
    .saveNotesHandler({ noteId: req.params.noteId, action: "remove" })
    .then(() => {
      console.log("removed...", req.body.noteId);
      return res.status(200).json({ message: "Note is removed successfully!" });
    })
    .catch((error) => {
      console.log(error);
      return res.send(error);
    });
};
