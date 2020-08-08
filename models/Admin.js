const User = require("./User");
const ObjectID = require("mongodb").ObjectID;
const userCollection = require("../db").db().collection("users");
const sessionCollection = require("../db").db().collection("sessions");
const contributorsCollection = require("../db").db().collection("contributors");
const notesCollection = require("../db").db().collection("notes");

let Admin = function (data) {
  this.data = data;
  this.errors = [];
};

Admin.handleSearch = (searchTerm, basedOn) => {
  return new Promise((resolve, reject) => {
    if (typeof searchTerm == "string" && typeof basedOn == "string") {
      if (basedOn === "username") {
        User.findByUsername(searchTerm)
          .then((user) => {
            user.joinedOn = {
              date: user.joinedOn.getDate(),
              month: user.joinedOn.getMonth(),
              year: user.joinedOn.getFullYear(),
            };
            resolve(user);
          })
          .catch((err) => reject(err));
      } else if (basedOn === "faculty") {
        User.findByFaculty(searchTerm)
          .then((users) => {
            users = users.map((user) => {
              user.joinedOn = {
                date: user.joinedOn.getDate(),
                month: user.joinedOn.getMonth(),
                year: user.joinedOn.getFullYear(),
              };
              return user;
            });
            resolve(users);
          })
          .catch((error) => reject(error));
      }
    } else {
      reject("the value is not of type 'string'");
    }
  });
};

Admin.findAndApproveUser = (userId) => {
  userId = new ObjectID(userId);

  //updates the isApproved field
  return new Promise((resolve, reject) => {
    userCollection
      .updateOne({ _id: userId }, { $set: { isApproved: true } })
      .then(() => {
        sessionCollection.deleteOne({ userId: userId });
        resolve("Approved successfully");
      })
      .catch((error) => reject(error));
  });
};

Admin.findAndApproveContributor = (contributor) => {
  contributor = new ObjectID(contributor);

  //updates the isApproved field
  return new Promise((resolve, reject) => {
    contributorsCollection
      .updateOne({ _id: contributor }, { $set: { isApproved: true } })
      .then(() => {
        resolve("Approved successfully");
      })
      .catch((error) => reject(error));
  });
};

Admin.findAndDisapproveUser = (userId) => {
  userId = new ObjectID(userId);

  //updates the isApproved field
  return new Promise((resolve, reject) => {
    userCollection
      .updateOne({ _id: userId }, { $set: { isApproved: false } })
      .then(() => {
        sessionCollection.deleteOne({ userId: userId });
        resolve("Disapproved successfully");
      })
      .catch((error) => reject(error));
  });
};

Admin.findAndDisapproveContributor = (contributorId) => {
  contributorId = new ObjectID(contributorId);

  //updates the isApproved field
  return new Promise((resolve, reject) => {
    contributorsCollection
      .updateOne({ _id: contributorId }, { $set: { isApproved: false } })
      .then(() => {
        resolve("Disapproved successfully");
      })
      .catch((error) => reject(error));
  });
};

Admin.findAndRemoveContributor = (userId) => {
  userId = new ObjectID(userId);
  return new Promise((resolve, reject) => {
    userCollection
      .findOneAndUpdate({ _id: userId }, { $pull: { roles: "contributor" } })
      .then((recentContributor) => {
        if (recentContributor.value)
          resolve({
            _id: recentContributor.value._id,
            username: recentContributor.value.username,
          });
        else reject("while removing contributor: no match found for that id");
      })
      .catch((error) => reject(error));
  });
};

Admin.getAllContributors = () => {
  return new Promise((resolve, reject) => {
    contributorsCollection
      .find({})
      .toArray()
      .then((contributors) => resolve(contributors))
      .catch((err) => reject(err));
  });
};

Admin.getAllNotes = () => {
  return new Promise((resolve, reject) => {
    notesCollection
      .find({})
      .toArray()
      .then((notes) => resolve(notes))
      .catch((err) => reject(err));
  });
};

const cleanUp = (noteDetails) => {
  if (typeof noteDetails.title !== "string") noteDetails.title = "";
  if (typeof noteDetails.subject !== "string") noteDetails.subject = "";
  if (typeof noteDetails.faculty !== "string") noteDetails.faculty = "";
  if (typeof noteDetails.semester !== "string") noteDetails.semester = "";
  if (typeof noteDetails.contributor !== "string") noteDetails.contributor = "";

  this.noteDetails = {
    unitNo: noteDetails.unitNo,
    title: noteDetails.title,
    subject: noteDetails.subject,
    faculty: noteDetails.faculty,
    semester: noteDetails.semester,
    url: `/notes/${noteDetails.faculty}/${
      noteDetails.semester
    }/${encodeURIComponent(noteDetails.subject)}/${encodeURIComponent(
      noteDetails.title
    )}`,
    createdDate: new Date(),
    contributor: new ObjectID(noteDetails.contributor),
  };
};

Admin.createNote = (noteDetails) => {
  cleanUp(noteDetails);
  return new Promise((resolve, reject) => {
    notesCollection
      .insertOne(this.noteDetails)
      .then(() => resolve("Note Created Successfully"))
      .catch((error) => reject(error));
  });
};

module.exports = Admin;
