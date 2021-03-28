const { ObjectID } = require("mongodb");
const { User } = require("./User");

let userCollection;
let contributorsCollection;
let notesCollection;

require("./utils/dbCollectionInit")(["users", "contributors", "notes"])
  .then((collections) => {
    if (collections !== null) {
      [userCollection, contributorsCollection, notesCollection] = collections;
    }
  })
  .catch((error) => console.log(error));

const setCollection = function setCollection(collections) {
  ({ userCollection, contributorsCollection, notesCollection } = collections);
};

function timeAgo(date) {
  const milliseconds = new Date() - date;
  let seconds = parseInt(milliseconds / 1000);
  let minutes = 0,
    hours = 0,
    days = 0;

  if (seconds > 60) {
    minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds) % 60;
  }

  if (minutes > 60) {
    hours = parseInt(minutes / 60);
    minutes = parseInt(minutes) % 60;
  }

  if (hours > 24) {
    days = parseInt(hours / 60);
    hours = parseInt(hours) % 24;
  }

  if (days > 0) {
    return days + (days === 1 ? " day ago" : " days ago");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  } else {
    return seconds + (seconds === 1 ? " second ago" : " seconds ago");
  }
}

const Admin = function Admin(data) {
  this.data = data;
  this.errors = [];
};

Admin.prototype.handleSearch = (searchTerm, basedOn) => {
  return new Promise((resolve, reject) => {
    if (
      (typeof searchTerm !== "string" && typeof basedOn !== "string") ||
      !["email", "faculty", "semester"].includes(basedOn)
    ) {
      return reject(new Error("The parameters provided are invalid"));
    }

    switch (basedOn) {
      case "email":
        User.prototype
          .findBy({ criteria: "email", value: searchTerm })
          .then((user) => {
            const modifiedUser = user;
            modifiedUser.joinedOn = {
              date: user.joinedOn.getDate(),
              month: user.joinedOn.getMonth(),
              year: user.joinedOn.getFullYear(),
            };
            modifiedUser.lastLogin = {
              date: user.lastLogin.getDate(),
              month: user.lastLogin.getMonth(),
              year: user.lastLogin.getFullYear(),
              timeAgo: timeAgo(user.lastLogin),
            };
            return resolve(modifiedUser);
          })
          .catch((err) => reject(err));
        break;

      case "faculty":
        User.prototype
          .findBy({ criteria: "faculty", value: searchTerm })
          .then((users) => {
            const modifiedUsers = users.map((user) => {
              const modifiedUser = user;
              modifiedUser.joinedOn = {
                date: user.joinedOn.getDate(),
                month: user.joinedOn.getMonth(),
                year: user.joinedOn.getFullYear(),
              };
              modifiedUser.lastLogin = {
                date: user.lastLogin.getDate(),
                month: user.lastLogin.getMonth(),
                year: user.lastLogin.getFullYear(),
                timeAgo: timeAgo(user.lastLogin),
              };
              return modifiedUser;
            });
            return resolve(modifiedUsers);
          })
          .catch((err) => {
            console.log(err);
            return reject(err);
          });
        break;

      case "semester":
        User.prototype
          .findBy({ criteria: "semester", value: searchTerm })
          .then((users) => {
            const modifiedUsers = users.map((user) => {
              const modifiedUser = user;
              modifiedUser.joinedOn = {
                date: user.joinedOn.getDate(),
                month: user.joinedOn.getMonth(),
                year: user.joinedOn.getFullYear(),
              };
              modifiedUser.lastLogin = {
                date: user.lastLogin.getDate(),
                month: user.lastLogin.getMonth(),
                year: user.lastLogin.getFullYear(),
                timeAgo: timeAgo(user.lastLogin),
              };
              return modifiedUser;
            });
            return resolve(modifiedUsers);
          })
          .catch((err) => {
            console.log(err);
            return reject(err);
          });
    }
  });
};

Admin.prototype.findAndRemoveContributor = (userId) => {
  return new Promise((resolve, reject) => {
    userCollection
      .findOneAndUpdate(
        { _id: new ObjectID(userId) },
        { $pull: { roles: "contributor" } }
      )
      .then((recentContributor) => {
        if (recentContributor.value)
          resolve({
            _id: recentContributor.value._id,
            username: recentContributor.value.username,
          });
        else
          reject(
            new Error("while removing contributor: no match found for that id")
          );
      })
      .catch((error) => reject(error));
  });
};

Admin.prototype.findAndMakeContributor = (userId) => {
  return new Promise((resolve, reject) => {
    userCollection
      .findOneAndUpdate(
        { _id: new ObjectID(userId) },
        { $push: { roles: "contributor" } }
      )
      .then((recentContributor) => {
        if (recentContributor.value)
          resolve({
            _id: recentContributor.value._id,
          });
        else
          reject(
            new Error("while making contributor: no match found for that id")
          );
      })
      .catch((error) => reject(error));
  });
};

Admin.prototype.getAllContributors = () => {
  const aggregation = [
    {
      $lookup: {
        from: "users",
        as: "user",
        let: {
          userId: "$userId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$userId"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              email: 1,
              firstName: 1,
              lastName: 1,
              lastLogin: 1,
            },
          },
        ],
      },
    },
  ];
  return new Promise((resolve, reject) => {
    contributorsCollection
      .aggregate(aggregation)
      .toArray()
      .then((contributors) => {
        const updatedContributors = contributors.map((contributor) => {
          const { user, ...rest } = contributor;
          return { ...rest, ...user[0] };
        });
        return resolve(updatedContributors);
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
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

Admin.prototype.cleanUp = function cleanUp() {
  const dataKeys = Object.keys(this.data);
  dataKeys.forEach((key) => {
    if (typeof this.data[key] !== "string") {
      this.data[key] = "";
      this.errors.push(`"${key}" is not of valid type.`);
    }
  });

  this.data = {
    unit: parseInt(this.data.unit, 10),
    title: this.data.title,
    subject: this.data.subject,
    faculty: this.data.faculty.toLowerCase(),
    semester: this.data.semester.toLowerCase(),
    url: `/notes/${this.data.faculty.toLowerCase()}/${this.data.semester.toLowerCase()}/${encodeURIComponent(
      this.data.subject.toLowerCase()
    )}/${encodeURIComponent(this.data.title.toLowerCase())}`,
    contributor: new ObjectID(this.data.contributor),
    note: this.data.note,
    createdDate: Date.now(),
  };
};

Admin.prototype.createNote = function createNote(data) {
  this.data = data;
  this.cleanUp();
  return new Promise((resolve, reject) => {
    if (!this.errors.length) {
      notesCollection
        .insertOne(this.data)
        .then((newNote) => resolve(newNote.ops[0]))
        .catch((error) => reject(error));
    } else reject(this.errors);
  });
};

module.exports = { Admin, setCollection };
