const { ObjectID } = require("mongodb");

let contributorsCollection;

require("./utils/dbCollectionInit")(["contributors"])
  .then((collections) => {
    if (collections !== null) {
      [contributorsCollection] = collections;
    }
  })
  .catch((error) => console.log(error));

const setCollection = function setCollection(collection) {
  contributorsCollection = collection;
};
const Contributor = function Contributor(data) {
  this.data = data;
  this.errors = [];
};

Contributor.prototype.cleanUp = function cleanUp() {
  if (typeof this.data.userId !== "string") {
    this.errors.push("Invalid userId received");
    return;
  }

  this.data = {
    userId: ObjectID(this.data.userId),
    joinedOn: new Date(),
    recentContribution: null,
    contacts: {
      facebookProfileUrl: null,
      twitterProfileUrl: null,
      githubProfileUrl: null,
      websiteProfileUrl: null,
    },
  };
};

Contributor.prototype.findBy = function findBy({ criteria, value, update }) {
  return new Promise((resolve, reject) => {
    if (
      typeof criteria !== "string" ||
      !["ObjectId", "OAuthId", "email"].includes(criteria)
    ) {
      return reject(new Error("Invalid criteria is provided"));
    }

    if (
      update &&
      (typeof update !== "string" || !["lastLogin"].includes(update))
    ) {
      return reject(new Error("Invalid update value is provided"));
    }

    let queryObject;
    let atMostOne = false;
    switch (criteria) {
      case "ObjectId":
        queryObject = { _id: value };
        atMostOne = true;
        break;
      case "OAuthId":
        queryObject = { OAuthId: value };
        atMostOne = true;
        break;
      case "email":
        queryObject = { email: value };
        atMostOne = true;
        break;
    }

    if (!update) {
      contributorsCollection
        .find(queryObject)
        .toArray()
        .then((contributors) => {
          if (contributors.length) {
            if (atMostOne) {
              return resolve(contributors[0]);
            }
            return resolve(contributors);
          }
          return reject(
            new Error(`Cannot find any contributor with that ${criteria}`)
          );
        })
        .catch((error) => console.log(error));
    } else {
      let updateFilter;
      switch (update) {
        case "lastLogin":
          updateFilter = {
            $set: {
              lastLogin: new Date(),
            },
          };
          break;
      }
      contributorsCollection
        .findOneAndUpdate(queryObject, updateFilter, { returnOriginal: false })
        .then((updatedContributor) => {
          if (updatedContributor.value) {
            return resolve(updatedContributor.value);
          }
          return reject(
            new Error(`Cannot find any contributor with that ${criteria}`)
          );
        })
        .catch((err) => console.log(err));
    }
  });
};

Contributor.prototype.create = function create() {
  this.cleanUp();
  return new Promise((resolve, reject) => {
    if (this.errors.length > 0) {
      return reject(this.errors);
    }
    contributorsCollection
      .insertOne(this.data)
      .then((contributor) => resolve(contributor.ops[0]))
      .catch((error) => reject(error));
  });
};

Contributor.getAll = function getAll() {
  return new Promise((resolve, reject) => {
    contributorsCollection
      .find({})
      .toArray()
      .then((contributors) => {
        return resolve(contributors);
      })
      .catch((err) => reject(err));
  });
};

module.exports = { Contributor, setCollection };
