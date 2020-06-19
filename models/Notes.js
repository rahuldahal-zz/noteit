const notesCollection = require("../db").db().collection("notes");
const ObjectID = require("mongodb").ObjectID;

let Notes = function (data) {
    this.data = data;
    this.errors = [];
}


Notes.prototype.cleanUp = function () {
    if (typeof (this.data.title) !== "string") this.data.title = "";
    if (typeof (this.data.subject) !== "string") this.data.subject = "";
    if (typeof (this.data.faculty) !== "string") this.data.faculty = "";
    if (typeof (this.data.semester) !== "string") this.data.semester = "";


    this.data = {
        unitNo: this.data.unitNo,
        title: this.data.title,
        subject: this.data.subject,
        faculty: this.data.faculty,
        semester: this.data.semester,
        url: `/notes/${this.data.faculty}/${this.data.semester}/${encodeURIComponent(this.data.subject)}/${encodeURIComponent(this.data.title)}`,
        createdDate: new Date(),
        contributor: new ObjectID(this.data.contributor)
    }
}

Notes.prototype.createNewNote = function () {
    this.cleanUp();
    return new Promise((resolve, reject) => {
        notesCollection.insertOne(this.data)
            .then(() => resolve("Note Created Successfully"))
            .catch((error) => reject(error));
    })
}

Notes.prototype.findNotes = function () {
    return new Promise((resolve, reject) => {
        // find({ faculty: this.data.faculty, semester: this.data.semester }).toArray()
        notesCollection.aggregate([
            { $match: { faculty: this.data.faculty, semester: this.data.semester } },
            { $lookup: { from: "users", localField: "contributor", foreignField: "_id", as: "contributorDocument" } },
            {
                $project: {
                    _id: 1,
                    unitNo: 1,
                    title: 1,
                    subject: 1,
                    faculty: 1,
                    semester: 1,
                    url: 1,
                    createdDate: 1,
                    contributor: { $arrayElemAt: ["$contributorDocument", 0] }
                }
            }
        ]).toArray()
            .then((availableNotes) => {
                if (availableNotes.length) {
                    //clean up contributor prop to include username and photo
                    availableNotes = availableNotes.map((note) => {
                        note.contributor = {
                            _id: note.contributor._id,
                            username: note.contributor.username
                        }
                        return note;
                    })
                    resolve(availableNotes);
                }
                else reject();
            })
            .catch((error) => console.log(error));
    })

}

Notes.prototype.findRequestedNote = function (basedOn, value) {
    return new Promise((resolve, reject) => {
        console.log(basedOn, value);
        if (!basedOn) reject("'basedOn' parameter is not provided");
        if (basedOn === "title") {
            notesCollection.findOne({ faculty: this.data.faculty, semester: this.data.semester, title: value })
                .then((note) => {
                    if (note) resolve(note);
                    else reject("No match found for that value.");
                })
                .catch((error) => console.log(error));
        }
        if (basedOn === "id") {
            value = new ObjectID(value);
            console.log(value);
            notesCollection.findOne({ faculty: this.data.faculty, semester: this.data.semester, _id: value })
                .then((note) => {
                    if (note) resolve(note);
                    else reject("No match found for that value.");
                })
                .catch((error) => console.log(error));
        }
    })
}

Notes.hasVisitorContributedThatNote = function (title, userId) {
    return new Promise((resolve, reject) => {
        notesCollection.findOne({ title: title })
            .then((requestedNote) => {
                if (!requestedNote) {
                    reject("not found");
                    return;
                }
                if (requestedNote.contributor.toString() === userId.toString())
                    resolve(true);
                else reject(false);

            })
    })
}

Notes.search = function (searchTerm, faculty, semester) {
    return new Promise((resolve, reject) => {
        if (!typeof searchTerm === "string") {
            reject();
            return;
        }
        notesCollection.aggregate([
            { $match: { $text: { $search: searchTerm } } },
            { $sort: { score: { $meta: "textScore" } } }
        ]).toArray()
            .then((queriedNotes) => {
                if (queriedNotes.length) {
                    queriedNotes = queriedNotes
                        .filter((note) => note.faculty === faculty && note.semester === semester)
                        .map((note) => {
                            note = {
                                unitNo: note.unitNo,
                                title: note.title,
                                subject: note.subject,
                                url: note.url
                            }
                            return note;
                        });
                    resolve(queriedNotes);
                    return;
                }
                reject();
            })
            .catch((error) => console.log(error))
    })
}

module.exports = Notes;