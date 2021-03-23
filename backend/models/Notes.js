const { ObjectID } = require("mongodb");

let notesCollection;

require("./utils/dbCollectionInit")(["notes"])
  .then((collections) => {
    if (collections !== null) {
      [notesCollection] = collections;
    }
  })
  .catch((error) => console.log(error));

const setCollection = function (collection) {
  notesCollection = collection;
};

const Notes = function (data) {
  this.data = data;
  this.errors = [];
};

Notes.prototype.findNotes = function findNotes() {
  return new Promise((resolve, reject) => {
    notesCollection
      .find({
        faculty: this.data.faculty,
        semester: this.data.semester,
      })
      .toArray()
      .then((notes) => resolve(notes))
      .catch((error) => reject(new Error(error)));
  });
};

Notes.prototype.findRequestedNote = function findRequestedNote(_id) {
  return new Promise((resolve, reject) => {
    notesCollection
      .findOne({
        faculty: this.data.faculty,
        semester: this.data.semester,
        _id: new ObjectID(_id),
      })
      .then((note) => {
        if (note) return resolve(note);
        return reject(new Error(`No match found for that id:${_id}`));
      })
      .catch((error) => console.log(error));
  });
};

module.exports = { Notes, setCollection };
