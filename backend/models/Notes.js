const { ObjectID } = require("mongodb");

let notesCollection;

require("./utils/dbCollectionInit")(["notes"])
  .then((collections) => {
    if (collections !== null) {
      [notesCollection] = collections;
    }
  })
  .catch((error) => console.log(error));

const setCollection = function setCollection(collection) {
  notesCollection = collection;
};

const Notes = function Notes(data) {
  this.data = data;
  this.errors = [];
};

Notes.prototype.findNotes = function findNotes(faculty, semester) {
  return new Promise((resolve, reject) => {
    const aggregationArray = [
      {
        $match: {
          faculty,
          semester,
        },
      },
      {
        $lookup: {
          from: "contributors",
          as: "contributorUserId",
          let: {
            contributor: "$contributor",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$contributor"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                userId: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          as: "contributorInfo",
          let: {
            contributorUserId: {
              $arrayElemAt: ["$contributorUserId.userId", 0],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$contributorUserId"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                picture: 1,
              },
            },
          ],
        },
      },
      {
        $set: {
          contributorInfo: {
            $arrayElemAt: ["$contributorInfo", 0],
          },
        },
      },
      {
        $project: {
          contributor: 0,
          contributorUserId: 0,
          faculty: 0,
          semester: 0,
        },
      },
    ];
    notesCollection
      .aggregate(aggregationArray)
      .toArray()
      .then((notes) => {
        const subjectWiseNote = {};
        notes.forEach((note) => {
          const { subject, ...rest } = note;
          const isSubjectAProperty = Object.prototype.hasOwnProperty.call(
            subjectWiseNote,
            subject
          );
          if (isSubjectAProperty) {
            subjectWiseNote[subject] = [...subjectWiseNote[subject], rest];
          } else {
            subjectWiseNote[subject] = [rest];
          }
        });
        return resolve(subjectWiseNote);
      })
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

Notes.prototype.searchNotes = function searchNotes(searchTerm) {
  return new Promise((resolve, reject) => {
    const aggregationArray = [
      {
        $search: {
          text: {
            query: searchTerm,
            path: "note",
          },
        },
      },
      {
        $project: {
          url: 1,
          title: 1,
          unit: 1,
          score: {
            $meta: "searchScore",
          },
        },
      },
    ];

    notesCollection
      .aggregate(aggregationArray)
      .toArray()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

module.exports = { Notes, setCollection };
