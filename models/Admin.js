const User = require("./User");
const ObjectID = require("mongodb").ObjectID;
const userCollection = require("../db").db().collection("users");
const sessionCollection = require("../db").db().collection("sessions");

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

Admin.findAndApproveOne = (userId) => {
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
Admin.findAndDisapproveOne = (userId) => {
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

module.exports = Admin;
