let contributorsCollection;
let followsCollection;
require("../db")
  .then((client) => {
    followsCollection = client.db().collection("follows");
    contributorsCollection = client.db().collection("contributors");
  })
  .catch((err) => console.log(err));
const ObjectID = require("mongodb").ObjectID;

let Follow = function (contributorId, visitorId) {
  this.contributorId = contributorId;
  this.visitorId = visitorId;
  this.errors = [];
};

Follow.prototype.cleanUp = function () {
  if (typeof this.contributorId !== "string") this.contributorId = "";
};

Follow.prototype.validate = function () {
  //contributorId must exist
  return new Promise((resolve, reject) => {
    contributorsCollection
      .findOne({ _id: new ObjectID(this.contributorId) })
      .then((contributorAccount) => {
        if (contributorAccount) {
          resolve();
          return;
        }
        this.errors.push("That contributor does not exist.");
        reject();
      })
      .catch((error) => console.log(error));
  });
};

Follow.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate()
      .then(() => {
        followsCollection
          .insertOne({
            contributorId: new ObjectID(this.contributorId),
            followerUserId: new ObjectID(this.visitorId),
          })
          .then((contributor) => resolve(contributor.ops[0]))
          .catch((error) => console.log(error));
      })
      .catch(() => reject(this.errors));
  });
};

Follow.prototype.remove = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate()
      .then(() => {
        followsCollection
          .deleteOne({
            contributorId: new ObjectID(this.contributorId),
          })
          .then(() => resolve())
          .catch((error) => console.log(error));
      })
      .catch(() => reject(this.errors));
  });
};

Follow.isVisitorFollowing = function (contributorId, visitorId) {
  return new Promise((resolve, reject) => {
    followsCollection
      .findOne({
        contributorId: new ObjectID(contributorId),
        followerUserId: new ObjectID(visitorId),
      })
      .then((followedContributor) => {
        if (followedContributor) {
          resolve();
          return;
        }
        reject();
      })
      .catch((error) => console.log(error));
  });
};

module.exports = Follow;
