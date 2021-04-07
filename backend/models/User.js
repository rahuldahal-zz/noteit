const { signRefreshToken } = require("@utils/jwtConfig");
const { ObjectID } = require("mongodb");

let usersCollection;

require("./utils/dbCollectionInit")(["users"])
  .then((collections) => {
    if (collections !== null) {
      [usersCollection] = collections;
    }
  })
  .catch((error) => console.log(error));

const setCollection = function setCollection(collection) {
  usersCollection = collection;
};

const User = function User(data, provider) {
  this.data = data;
  this.provider = provider;
  this.errors = [];
};

User.prototype.validateAndCleanUp = function validateAndCleanUp() {
  const validProperties = ["id", "email", "firstName", "lastName", "picture"];
  const dataProperties = Object.keys(this.data);
  dataProperties.forEach((property) => {
    if (!validProperties.includes(property)) {
      this.errors.push(`bogus property ${property} received`);
    } else if (typeof this.data[property] !== "string") {
      this.errors.push(`unacceptable value type on ${property} property`);
    }
  });

  this.data = {
    OAuthId: this.data.id,
    email: this.data.email,
    firstName: this.data.firstName,
    lastName: this.data.lastName,
    picture: this.data.picture,
    provider: this.provider,
    faculty: null,
    semester: null,
    roles: ["basic"], // ["basic", "contributor", "moderator", "admin"]
    isSubscriptionExpired: false,
    joinedOn: new Date(),
    savedNotes: [],
    sessionCount: 0,
    lastLogin: new Date(),
    refreshToken: signRefreshToken({
      OAuthId: this.data.id,
      name: this.data.firstName,
    }),
  };

  if (this.errors.length > 0) {
    return this.errors;
  }
  return null;
};

User.prototype.validateFacultyAndSemester = function validateFacultyAndSemester(
  faculty,
  semester
) {
  // faculty validation
  const acceptableFaculty = ["bim", "bca", "csit"];
  const isFacultyValid = acceptableFaculty.some(
    (element) => faculty === element
  );
  if (!isFacultyValid) this.errors.push("faculty is not valid");

  // semester validation
  const acceptableSemester = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
  ];
  const isSemesterValid = acceptableSemester.some(
    (element) => semester === element
  );
  if (!isSemesterValid) this.errors.push("semester is not valid");
};

User.prototype.create = function create() {
  return new Promise((resolve, reject) => {
    this.validateAndCleanUp();
    if (this.errors.length > 0) {
      return reject(this.errors);
    }
    usersCollection
      .insertOne(this.data)
      .then((newUser) => {
        if (newUser.ops[0]) return resolve(newUser.ops[0]);
        return reject(new Error("Cannot create the user"));
      })
      .catch((error) => console.log(error));
    return null;
  });
};

User.prototype.updateRefreshToken = function updateRefreshToken(_id) {
  return new Promise((resolve, reject) => {
    const refreshToken = signRefreshToken({ _id });
    usersCollection
      .findOneAndUpdate({ _id }, { $set: { refreshToken } })
      .then(({ n, updatedExisting, value }) => {
        if (n === 1 && updatedExisting === true) {
          return resolve(value.refreshToken);
        }
        return reject(new Error(`User with _id: ${_id} is not found`));
      })
      .catch((err) => {
        console.log(err);
        return reject(err);
      });
  });
};

User.prototype.sessionCountHandler = function sessionCountHandler(id, action) {
  return new Promise((resolve, reject) => {
    if (new ObjectID(id).toString() !== id.toString()) {
      return reject(new Error("Invalid ObjectID is provided."));
    }

    if (!["increment", "decrement"].includes(action)) {
      return reject(
        new Error(
          "Invalid action is provided. Only increment and decrement are accepted."
        )
      );
    }

    if (action === "increment") {
      return usersCollection
        .findOneAndUpdate(
          { _id: new ObjectID(id) },
          { $inc: { sessionCount: 1 } },
          { returnOriginal: false }
        )
        .then((updatedUser) => {
          if (updatedUser.value) {
            resolve(updatedUser.value);
          } else reject(new Error("Cannot find the user"));
        })
        .catch((err) => reject(err));
    }

    if (action === "decrement") {
      return usersCollection
        .findOneAndUpdate(
          { _id: new ObjectID(id) },
          { $inc: { sessionCount: -1 } },
          { returnOriginal: false }
        )
        .then((updatedUser) => {
          if (updatedUser.value) {
            resolve(updatedUser.value);
          } else reject(new Error("Cannot find the user"));
        })
        .catch((err) => reject(err));
    }

    return null;
  });
};

User.prototype.saveFacultyAndSemester = function saveFacultyAndSemester(
  faculty,
  semester
) {
  return new Promise((resolve, reject) => {
    if (typeof faculty !== "string" || typeof semester !== "string") {
      return reject(new Error("Unacceptable values are provided"));
    }

    const facultyLowercase = faculty.toLowerCase();
    const semesterLowercase = semester.toLowerCase();

    this.validateFacultyAndSemester(facultyLowercase, semesterLowercase);

    if (this.errors.length === 0) {
      usersCollection
        .findOneAndUpdate(
          { _id: new ObjectID(this.data._id) },
          {
            $set: {
              faculty: facultyLowercase,
              semester: semesterLowercase,
            },
          },
          { returnOriginal: false }
        )
        .then((updatedUser) => {
          if (updatedUser.value) return resolve(updatedUser.value);
          return reject(new Error("The requested user cannot be found"));
        })
        .catch((error) => {
          console.log(error);
          return reject(new Error("rejected for server-side error"));
        });
    } else {
      return reject(this.errors);
    }

    return null;
  });
};

User.prototype.saveNotesHandler = function saveNotesHandler(
  noteId,
  action = "save"
) {
  return new Promise((resolve, reject) => {
    if (
      !ObjectID.isValid(noteId) ||
      new ObjectID(noteId).toString() !== noteId.toString()
    ) {
      return reject(new Error("Invalid ObjectID is provided for that note."));
    }

    if (!["save", "remove"].includes(action)) {
      return reject(
        new Error(
          "Invalid action is provided. Only save and remove are accepted."
        )
      );
    }

    const queryObject =
      action === "save"
        ? { $push: { savedNotes: noteId } }
        : { $pull: { savedNotes: noteId } };

    usersCollection
      .findOneAndUpdate({ _id: new ObjectID(this.data._id) }, queryObject, {
        returnOriginal: false,
      })
      .then((updatedUser) => {
        if (updatedUser.value) resolve(updatedUser.value);
        else reject(new Error("Cannot find the user"));
      })
      .catch((error) => console.log(error));

    return null;
  });
};

User.prototype.findSavedNotes = function findSavedNotes() {
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ _id: new ObjectID(this.data._id) })
      .then((user) => {
        if (user) resolve(user.savedNotes);
        else reject(new Error("Cannot find the user"));
      })
      .catch((error) => console.log(error));
  });
};

User.prototype.findBy = function findBy({ criteria, value, update }) {
  return new Promise((resolve, reject) => {
    if (
      typeof criteria !== "string" ||
      !["ObjectId", "OAuthId", "email", "faculty", "semester", "role"].includes(
        criteria
      )
    ) {
      return reject(
        new Error(
          JSON.stringify({
            reason: "invalidArgument",
            message: "Invalid criteria is provided",
          })
        )
      );
    }

    if (
      update &&
      (typeof update !== "string" || !["lastLogin"].includes(update))
    ) {
      return reject(
        new Error(
          JSON.stringify({
            reason: "invalidArgument",
            message: "Invalid update value is provided",
          })
        )
      );
    }

    let queryObject;
    let atMostOne = false;
    switch (criteria) {
      case "ObjectId":
        queryObject = { _id: new ObjectID(value) };
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
      case "faculty":
        queryObject = { faculty: value };
        break;
      case "semester":
        queryObject = { semester: value };
        break;
      case "role":
        queryObject = { roles: value };
        break;
    }

    if (!update) {
      usersCollection
        .find(queryObject)
        .toArray()
        .then((users) => {
          if (users.length) {
            if (atMostOne) {
              return resolve(users[0]);
            }
            return resolve(users);
          }
          return reject(
            new Error(
              JSON.stringify({
                reason: "noUser",
                message: `Cannot find any user with that ${criteria}`,
              })
            )
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
      usersCollection
        .findOneAndUpdate(queryObject, updateFilter, { returnOriginal: false })
        .then((updatedUser) => {
          if (updatedUser.value) {
            return resolve(updatedUser.value);
          }
          return reject(
            new Error(
              JSON.stringify({
                reason: "noUser",
                message: `Cannot find any user with that ${criteria} to update`,
              })
            )
          );
        })
        .catch((err) => console.log(err));
    }
  });
};

module.exports = { User, setCollection };
