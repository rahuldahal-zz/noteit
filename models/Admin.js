const User = require("./User");
const ObjectID = require("mongodb").ObjectID;
let userCollection;
let sessionCollection;
let contributorsCollection;
let notesCollection;

require("./utils/dbCollectionInit")([
  "users",
  "session",
  "contributors",
  "notes",
])
  .then((collections) => {
    if (collections !== null) {
      [
        usersCollection,
        sessionCollection,
        contributorsCollection,
        notesCollection,
      ] = collections;
    }
  })
  .catch((error) => console.log(error));

let setCollection = function (collections) {
  ({
    userCollection,
    sessionCollection,
    contributorsCollection,
    notesCollection,
  } = collections);
};

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

/**
 *
 * @param {Object} object - containing the userId and an optional action
 * @param {ObjectID} object.userId - ObjectID of the user in question
 * @param {String} [object.action=approve] - Acceptable: disapprove
 * @summary updates the isApproved field of the user doc.
 * @returns Promise
 */
Admin.prototype.handleUserApproval = ({ userId, action = "approve" }) => {
  return new Promise((resolve, reject) => {
    if (
      !ObjectID.isValid(userId) ||
      new ObjectID(userId).toString() !== userId.toString()
    ) {
      return reject("Invalid ObjectID is provided");
    }

    if (!["approve", "disapprove"].includes(action)) {
      return reject("Invalid action is provided");
    }

    userId = new ObjectID(userId);
    let updatedUserReference = false;
    let updateQuery = { $set: { isApproved: true } };

    if (action === "disapprove") {
      updateQuery = { $set: { isApproved: false } };
    }

    userCollection
      .findOneAndUpdate({ _id: userId }, updateQuery, { returnOriginal: false })
      .then((updatedUser) => {
        if (updatedUser.value) {
          updatedUserReference = updatedUser.value; // check this in the catch block
          return sessionCollection.deleteOne({ userId: userId });
        } else return reject("The user was not found");
      })
      .then(() => resolve(updatedUserReference))
      .catch(() => {
        if (updatedUserReference.value) {
          return reject(
            `${action}d the user, but had problem deleting their session`
          );
        } else {
          return reject("Server error, cannot approve the user");
        }
      });
  });
};

Admin.prototype.handleContributorApproval = ({
  contributorId,
  action = "approve",
}) => {
  return new Promise((resolve, reject) => {
    if (
      !ObjectID.isValid(contributorId) ||
      new ObjectID(contributorId).toString() !== contributorId.toString()
    ) {
      return reject("Invalid ObjectID is provided");
    }

    if (!["approve", "disapprove"].includes(action)) {
      return reject("Invalid action is provided");
    }

    contributorId = new ObjectID(contributorId);
    let updateQuery = { $set: { isApproved: true } };

    if (action === "disapprove") {
      updateQuery = { $set: { isApproved: false } };
    }

    contributorId = new ObjectID(contributorId);
    contributorsCollection
      .findOneAndUpdate({ _id: contributorId }, updateQuery, {
        returnOriginal: false,
      })
      .then((updatedContributor) => {
        if (updatedContributor.value) {
          return resolve(updatedContributor.value);
        } else {
          return reject("The contributor was not found");
        }
      })
      .catch((error) => reject(error));
  });
};

Admin.prototype.findAndRemoveContributor = (userId) => {
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

Admin.prototype.getAllContributors = () => {
  return new Promise((resolve, reject) => {
    contributorsCollection
      .find({})
      .toArray()
      .then((contributors) => resolve(contributors))
      .catch((err) => reject(err));
  });
};

Admin.prototype.getAllNotes = () => {
  return new Promise((resolve, reject) => {
    notesCollection
      .find({})
      .toArray()
      .then((notes) => resolve(notes))
      .catch((err) => reject(err));
  });
};

Admin.prototype.cleanUp = function () {
  for (let key in this.data) {
    if (typeof this.data[key] !== "string") {
      this.data[key] = "";
      this.errors.push(`"${key}" is not of valid type.`);
    }
  }

  this.data = {
    unitNo: this.data.unitNo,
    title: this.data.title,
    subject: this.data.subject,
    faculty: this.data.faculty,
    semester: this.data.semester,
    url: `/notes/${this.data.faculty}/${
      this.data.semester
    }/${encodeURIComponent(this.data.subject)}/${encodeURIComponent(
      this.data.title
    )}`,
    contributor: new ObjectID(this.data.contributor),
    note: this.data.note,
    createdDate: Date.now(),
  };
};

Admin.prototype.createNote = function () {
  // return console.log(this);
  this.cleanUp();
  return new Promise((resolve, reject) => {
    if (!this.errors.length) {
      notesCollection
        .insertOne(this.data)
        .then(() => resolve("Note Created Successfully"))
        .catch((error) => reject(error));
    } else reject(this.errors);
  });
};

module.exports = { Admin, setCollection };
