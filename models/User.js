// const validator = require("validator");
const usersCollection = require("../db").db().collection("users");
const ObjectID = require("mongodb").ObjectID;

let User = function (data, provider) {
  this.data = data;
  this.provider = provider;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  console.log(this.data.picture);

  if (this.provider === "google") {
    if (typeof this.data.sub != "string") this.data.sub = "";
    if (typeof this.data.email != "string") this.data.email = "";
    if (typeof this.data.name != "string") this.data.name = "";
    if (typeof this.data.given_name != "string") this.data.given_name = "";
    if (typeof this.data.family_name != "string") this.data.family_name = "";
    if (typeof this.data.picture != "string") this.data.picture = "";

    //ignore bogus properties

    this.userDetails = {
      OAuthId: this.data.sub,
      email: this.data.email.trim(),
      name: this.data.name,
      firstName: this.data.given_name,
      lastName: this.data.family_name,
      picture: this.picture,
      provider: this.provider,
    };
  }

  if (this.provider === "facebook") {
    if (typeof this.data.id != "string") this.data.id = "";
    if (typeof this.data.email != "string") this.data.email = "";
    if (typeof this.data.name != "string") this.data.name = "";
    if (typeof this.data.first_name != "string") this.data.first_name = "";
    if (typeof this.data.last_name != "string") this.data.last_name = "";
    if (typeof this.data.picture.data.url != "string") this.data.picture = "";
    else this.picture = this.data.picture.data.url;

    //ignore bogus properties

    this.userDetails = {
      OAuthId: this.data.id,
      email: this.data.email.trim(),
      name: this.data.name,
      firstName: this.data.first_name,
      lastName: this.data.last_name,
      picture: this.picture,
      provider: this.provider,
    };
  }

  this.data = {
    ...this.userDetails,
    faculty: null,
    semester: null,
    roles: ["basic"], // ["basic", "contributor", "moderator", "admin"]
    isApproved: false,
    isSubscriptionExpired: false,
    joinedOn: new Date(),
    savedNotes: [],
    sessionCount: 0,
    lastLogin: new Date(),
  };
};

User.prototype.validateFacultyAndSemester = function (faculty, semester) {
  console.log(faculty, semester);

  //faculty validation
  const acceptableFaculty = ["bim", "bca", "csit"];
  let isFacultyValid = false;
  for (let i = 0; i < acceptableFaculty.length; i++) {
    if (faculty == acceptableFaculty[i]) {
      isFacultyValid = true;
      break;
    }
  }
  if (!isFacultyValid) this.errors.push("faculty is not valid");

  //semester validation
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
  let isSemesterValid = false;
  for (let i = 0; i < acceptableSemester.length; i++) {
    if (semester == acceptableSemester[i]) {
      isSemesterValid = true;
      break;
    }
  }
  if (!isSemesterValid) this.errors.push("semester is not valid");
};

User.prototype.createUser = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    console.log("creating a new user...");
    usersCollection
      .insertOne(this.data)
      .then((newUser) => {
        if (newUser.ops[0]) return resolve(newUser.ops[0]);
        else return reject("Cannot create the user");
      })
      .catch((error) => console.log(error));
  });
};

User.prototype.sessionCountHandler = function (id, action) {
  return new Promise((resolve, reject) => {
    if (action === "increment") {
      usersCollection
        .findOneAndUpdate(
          { _id: new ObjectID(id) },
          { $inc: { sessionCount: 1 } }
        )
        .then((updatedUser) => {
          if (updatedUser.value) {
            resolve("Successfully Incremented sessionCount");
          } else reject("Cannot find the user");
        })
        .catch((err) => reject(err));
    }

    if (action === "decrement") {
      usersCollection
        .findOneAndUpdate(
          { _id: new ObjectID(id) },
          { $inc: { sessionCount: -1 } }
        )
        .then((updatedUser) => {
          if (updatedUser.value) {
            resolve("Successfully Decremented sessionCount");
          } else reject("Cannot find the user");
        })
        .catch((err) => reject(err));
    }
  });
};

User.prototype.saveFacultyAndSemester = function (faculty, semester) {
  faculty = faculty.toLowerCase();
  semester = semester.toLowerCase();

  return new Promise((resolve, reject) => {
    if (typeof faculty !== "string" || typeof semester !== "string") {
      return reject("Unacceptable values are provided");
    }

    this.validateFacultyAndSemester(faculty, semester);

    if (!this.errors.length) {
      usersCollection
        .findOneAndUpdate(
          { _id: new ObjectID(this.data._id) },
          {
            $set: {
              faculty: faculty,
              semester: semester,
            },
          }
        )
        .then((updatedUser) => {
          if (updatedUser.value) return resolve();
          return reject("The requested user cannot be found");
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    } else {
      return reject(this.errors);
    }
  });
};

User.prototype.saveNotes = function (noteId) {
  noteId = new ObjectID(noteId);
  return new Promise((resolve, reject) => {
    usersCollection
      .findOneAndUpdate(
        { _id: new ObjectID(this.data._id) },
        { $push: { savedNotes: noteId } }
      )
      .then((updatedUser) => {
        if (updatedUser.value) resolve("saved successfully");
        else reject("cannot find that document...or similar");
      })
      .catch((error) => console.log(error));
  });
};
User.prototype.removeSaved = function (noteId) {
  noteId = new ObjectID(noteId);
  return new Promise((resolve, reject) => {
    usersCollection
      .findOneAndUpdate(
        { _id: new ObjectID(this.data._id) },
        { $pull: { savedNotes: noteId } }
      )
      .then((updatedUser) => {
        if (updatedUser.value) resolve("removed saved successfully");
        else reject("cannot find that document...or similar");
      })
      .catch((error) => console.log(error));
  });
};
User.prototype.findSavedNotes = function () {
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ _id: new ObjectID(this.data._id) })
      .then((user) => {
        if (user) resolve(user.savedNotes);
        else reject("cannot find the user");
      })
      .catch((error) => console.log(error));
  });
};

User.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    if (typeof username != "string") {
      resolve("No a valid username value");
      return;
    }
    usersCollection
      .findOne({ name: username })
      .then((user) => {
        if (user) {
          resolve(user);
          return;
        } else {
          reject("from findByUsername: no match found");
          return;
        }
      })
      .catch((err) => reject(err));
  });
};

User.prototype.findByOAuthId = (id) => {
  return new Promise((resolve, reject) => {
    if (typeof id != "string") {
      reject("Not a valid OAuthId value");
      return;
    }
    usersCollection
      .findOneAndUpdate({ OAuthId: id }, { $set: { lastLogin: new Date() } })
      .then((updatedUser) => {
        if (updatedUser.value) {
          console.log(".....found...");
          resolve(updatedUser);
          return;
        } else {
          reject("from findByOAuthId: no match found");
          return;
        }
      })
      .catch((err) => console.log(error));
  });
};

User.prototype.findByObjectId = (id) => {
  return new Promise((resolve, reject) => {
    if (typeof id != "string") {
      reject("Not a valid id value");
      return;
    }
    usersCollection
      .findOne({ _id: new ObjectID(id) })
      .then((user) => {
        if (user) {
          resolve(user);
          return;
        } else {
          reject("from findByObjectId: no match found");
          return;
        }
      })
      .catch((err) => console.log(error));
  });
};

User.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (typeof email != "string") {
      resolve("No a valid username value");
      return;
    }
    usersCollection
      .findOne({ email: email })
      .then((user) => {
        if (user) {
          resolve(user);
          return;
        } else {
          reject("from findByEmail: No match found");
          return;
        }
      })
      .catch((err) => reject(err));
  });
};

User.findByFaculty = (faculty) => {
  return new Promise((resolve, reject) => {
    usersCollection
      .find({ faculty: faculty })
      .toArray()
      .then((users) => {
        resolve(users);
      })
      .catch((error) => reject(error));

    /**
     * the collection.find() would return the data that makes sense to the MongoDB env, but for JS, we want to
     * extract the data that we actually want into an array
     * find().toArray() does exactly that. Also, it returns a promise
     */
  });
};

User.findByRole = (role) => {
  return new Promise((resolve, reject) => {
    usersCollection
      .find({ roles: role })
      .toArray()
      .then((users) => {
        users = users.map((user) => {
          return (user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            faculty: user.faculty,
            semester: user.semester,
            joinedOn: user.joinedOn,
          });
        });
        resolve(users);
      })
      .catch((error) => reject(error));
  });
};

module.exports = User;
