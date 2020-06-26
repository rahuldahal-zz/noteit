const validator = require("validator");
const usersCollection = require("../db").db().collection("users");
const ObjectID = require("mongodb").ObjectID;

let User = function (data) {
    this.data = data;
    this.errors = [];
}

User.prototype.cleanUp = function () {
    if (typeof (this.data.sub) != "string")
        this.data.sub = "";
    if (typeof (this.data.email) != "string")
        this.data.email = "";
    if (typeof (this.data.name) != "string")
        this.data.name = "";
    if (typeof (this.data.given_name) != "string")
        this.data.given_name = "";
    if (typeof (this.data.family_name) != "string")
        this.data.family_name = "";
    if (typeof (this.data.picture) != "string")
        this.data.picture = "";

    //ignore bogus properties

    this.data = {
        sub: this.data.sub,
        email: this.data.email.trim(),
        name: this.data.name,
        given_name: this.data.given_name,
        family_name: this.data.family_name,
        faculty: null,
        semester: null,
        roles: ["basic"],
        isApproved: false,
        isSubscriptionExpired: false,
        joinedOn: new Date(),
        savedNotes: [],
        lastLogin: new Date()
    }
}



User.prototype.validate = function () {
    let username = this.data.username;
    let email = this.data.email;
    let password = this.data.password;
    let faculty = this.data.faculty;
    let semester = this.data.semester;

    return new Promise((resolve, reject) => {
        //username validation
        if (username == "")
            this.errors.push("username cannot be empty");
        if (username.length < 3 || username.length > 30)
            this.errors.push("username must be between 3 to 30 characters long");
        if (!validator.isAlphanumeric(username))
            this.errors.push("username can contain only letters and numbers");

        //email validation
        if (email == "")
            this.errors.push("email cannot be empty");
        if (!validator.isEmail(email))
            this.errors.push("please enter a valid email address");

        //password validation
        if (password == "")
            this.errors.push("password cannot be empty");
        if (password.length > 0 && password.length < 9)
            this.errors.push("password must be at least 9 characters")

        //faculty validation
        const acceptableFaculty = ["bim", "bca", "csit"];
        let isFacultyValid = false;
        for (let i = 0; i < acceptableFaculty.length; i++) {
            if (faculty == acceptableFaculty[i]) {
                isFacultyValid = true;
                break;
            }
        }
        if (!isFacultyValid)
            this.errors.push("faculty is not valid");

        //semester validation
        const acceptableSemester = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
        let isSemesterValid = false;
        for (let i = 0; i < acceptableSemester.length; i++) {
            if (semester == acceptableSemester[i]) {
                isSemesterValid = true;
                break;
            }
        }
        if (!isSemesterValid)
            this.errors.push("semester is not valid");

        //only if username is valid then check to see if it's already taken
        if (username.length > 2 &&
            username.length < 31 &&
            validator.isAlphanumeric(username)) {
            let usernameExists = usersCollection.findOne({ username: username })
                .then(() => {
                    if (usernameExists) {
                        this.errors.push("that username is already taken");
                        console.log(this.errors);
                    }
                })
        }
        //only if email is valid then check to see if it's already taken
        if (validator.isEmail(email)) {
            let emailExists = usersCollection.findOne({ email: email })
                .then(() => {
                    if (emailExists) {
                        this.errors.push("that email is already taken");
                        console.log(this.errors);
                    }
                })
        }
        resolve();
    })

}


User.prototype.createUser = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        console.log("creating a new user...");
        usersCollection.insertOne(this.data)
            .then((newUser) => {
                if (newUser.ops[0]) return resolve(newUser.ops[0])
                else return reject("Cannot create the user");
            })
            .catch((error) => console.log(error));
    })
}

User.prototype.saveNotes = function (noteId) {
    noteId = new ObjectID(noteId);
    return new Promise((resolve, reject) => {
        usersCollection.findOneAndUpdate(
            { _id: new ObjectID(this.data._id) },
            { $push: { savedNotes: noteId } }
        )
            .then((updatedUser) => {
                if (updatedUser.value)
                    resolve("saved successfully");
                else reject("cannot find that document...or similar");
            })
            .catch((error) => console.log(error))
    })
}
User.prototype.removeSaved = function (noteId) {
    noteId = new ObjectID(noteId);
    return new Promise((resolve, reject) => {
        usersCollection.findOneAndUpdate(
            { _id: new ObjectID(this.data._id) },
            { $pull: { savedNotes: noteId } }
        )
            .then((updatedUser) => {
                if (updatedUser.value)
                    resolve("removed saved successfully");
                else reject("cannot find that document...or similar");
            })
            .catch((error) => console.log(error))
    })
}
User.prototype.findSavedNotes = function () {
    return new Promise((resolve, reject) => {
        usersCollection.findOne({ _id: new ObjectID(this.data._id) })
            .then((user) => {
                if (user)
                    resolve(user.savedNotes);
                else reject("cannot find the user");
            })
            .catch((error) => console.log(error));
    })
}

User.findByUsername = (username) => {
    return new Promise((resolve, reject) => {
        if (typeof username != "string") {
            resolve("No a valid username value");
            return;
        }
        usersCollection.findOne({ name: username })
            .then((user) => {
                if (user) {
                    resolve(user);
                    return;
                }
                else {
                    reject("no match found");
                    return;
                }
            })
            .catch((err) => reject(err));
    })
}

User.prototype.findByGoogleId = (googleId) => {
    return new Promise((resolve, reject) => {
        if (typeof googleId != "string") {
            reject("Not a valid googleId value");
            return;
        }
        usersCollection.findOne({ sub: googleId })
            .then((user) => {
                if (user) {
                    resolve(user);
                    return;
                }
                else {
                    reject("no match found");
                    return;
                }
            })
            .catch((err) => console.log(error));
    })
}


User.prototype.findByObjectId = (id) => {
    return new Promise((resolve, reject) => {
        if (typeof id != "string") {
            reject("Not a valid id value");
            return;
        }
        usersCollection.findOne({ _id: new ObjectID(id) })
            .then((user) => {
                if (user) {
                    resolve(user);
                    return;
                }
                else {
                    reject("no match found");
                    return;
                }
            })
            .catch((err) => console.log(error));
    })
}

User.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        if (typeof email != "string") {
            resolve("No a valid username value");
            return;
        }
        usersCollection.findOne({ email: email })
            .then((user) => {
                if (user) {
                    resolve(user);
                    return;
                }
                else {
                    reject("No match found");
                    return;
                }
            })
            .catch((err) => reject(err));
    })
}


User.findByFaculty = (faculty) => {
    return new Promise((resolve, reject) => {
        usersCollection.find({ faculty: faculty }).toArray()
            .then((users) => {
                users = users.map((user) => {
                    return user = {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        faculty: user.faculty,
                        semester: user.semester,
                        roles: user.roles,
                        isApproved: user.isApproved,
                        isSubscriptionExpired: user.isSubscriptionExpired,
                        joinedOn: user.joinedOn
                    }
                })
                resolve(users);
            })
            .catch((error) => reject(error))

        /**
         * the collection.find() would return the data that makes sense to the MongoDB env, but for JS, we want to 
         * extract the data that we actually want into an array
         * find().toArray() does exactly that. Also, it returns a promise
         */
    })
}

User.findByRole = (role) => {
    return new Promise((resolve, reject) => {
        usersCollection.find({ roles: role }).toArray()
            .then((users) => {
                users = users.map((user) => {
                    return user = {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        faculty: user.faculty,
                        semester: user.semester,
                        joinedOn: user.joinedOn
                    }
                })
                resolve(users);
            })
            .catch((error) => reject(error))

    })
}


module.exports = User;


