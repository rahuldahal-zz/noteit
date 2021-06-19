const { Notes } = require("@models/Notes");

exports.sendNotesDescriptionToClient = (req, res) => {
  // finding notes from the db
  const notes = new Notes(req.user);
  notes
    .findNotes(req.payload.faculty, req.payload.semester)
    .then((availableNotes) => res.status(200).json(availableNotes))
    .catch((error) => res.status(400).json(error));
};

exports.searchNotes = (req, res) => {
  const notes = new Notes(req.user);
  const { searchTerm } = req.query;

  notes
    .searchNotes(searchTerm)
    .then((relevantNotes) => res.status(200).json(relevantNotes))
    .catch((error) => res.status(400).json(error));
};
