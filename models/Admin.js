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

module.exports = Admin;
