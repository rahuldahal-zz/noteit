const ObjectID = require("mongodb").ObjectID;
let contributorsCollection;

require("./utils/dbCollectionInit")(["contributors"])
  .then((collections) => {
    if (collections !== null) {
      [contributorsCollection] = collections;
    }
  })
  .catch((error) => console.log(error));

let setCollection = function (collection) {
  contributorsCollection = collection;
};
let Contributor = function (data) {
  this.data = data;
  this.errors = [];
};

Contributor.prototype.cleanUp = function () {
  for (let key in this.data) {
    if (key !== "picture" && typeof this.data[key] !== "string") {
      this.data[key] = "";
      this.errors.push(`"${key}" is not of valid type.`);
    }
    if (key === "picture" && typeof this.data[key].data.url !== "string") {
      this.data[key].data.url = "";
      this.errors.push("Picture URL is not of valid type");
    }
  }

  this.data = {
    OAuthId: this.data.id,
    name: this.data.name,
    firstName: this.data.first_name,
    lastName: this.data.last_name,
    email: this.data.email,
    picture: this.data.picture.data.url,
    joinedOn: new Date(),
    isApproved: false,
    recentContribution: null,
    contacts: {
      facebookProfileUrl: null,
      twitterProfileUrl: null,
      githubProfileUrl: null,
      websiteProfileUrl: null,
    },
  };
};

Contributor.prototype.findBy = function ({ criteria, value, update }) {
  return new Promise((resolve, reject) => {
    if (
      typeof criteria !== "string" ||
      !["ObjectId", "OAuthId", "email"].includes(criteria)
    ) {
      return reject("Invalid criteria is provided");
    }

    if (
      update &&
      (typeof update !== "string" || !["lastLogin"].includes(update))
    ) {
      return reject("Invalid update value is provided");
    }

    let queryObject,
      atMostOne = false;
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
            } else {
              return resolve(contributors);
            }
          }
          return reject(`Cannot find any contributor with that ${criteria}`);
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
          } else {
            return reject(`Cannot find any contributor with that ${criteria}`);
          }
        })
        .catch((err) => console.log(err));
    }
  });
};

Contributor.prototype.create = function () {
  this.cleanUp();
  return new Promise((resolve, reject) => {
    if (this.errors.length > 0) {
      return reject({ clientError: this.errors });
    }
    contributorsCollection
      .insertOne(this.data)
      .then((contributor) => resolve(contributor.ops[0]))
      .catch((error) => reject(error));
  });
};

Contributor.removeOne = function (userId) {
  return new Promise((resolve, reject) => {
    contributorsCollection
      .deleteOne({ userId: new ObjectID(userId) })
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};

Contributor.getAll = function () {
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

Contributor.editContacts = function (data) {
  let {
    contributorId,
    facebookProfileUrl,
    twitterProfileUrl,
    githubProfileUrl,
    websiteProfileUrl,
  } = data;
  let contacts = {
    facebookProfileUrl: facebookProfileUrl,
    twitterProfileUrl: twitterProfileUrl,
    githubProfileUrl: githubProfileUrl,
    websiteProfileUrl: websiteProfileUrl,
  };
  return new Promise((resolve, reject) => {
    if (
      typeof facebookProfileUrl !== "string" ||
      typeof twitterProfileUrl !== "string" ||
      typeof githubProfileUrl !== "string" ||
      typeof websiteProfileUrl !== "string"
    ) {
      return reject("the data is not a string");
    }
    contributorsCollection
      .findOneAndUpdate(
        { _id: new ObjectID(contributorId) },
        { $set: { contacts: contacts } }
      )
      .then((response) => resolve(response.value))
      .catch((error) => console.log(error));
  });
};

module.exports = { Contributor, setCollection };
