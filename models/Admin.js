const User = require("./User");
const ObjectID = require("mongodb").ObjectID;
const userCollection = require("../db").db().collection("users");
const sessionCollection = require("../db").db().collection("sessions");

let Admin = function (data) {
    this.data = data;
    this.errors = [];

}

Admin.handleSearch = (searchTerm, basedOn) => {
    return new Promise((resolve, reject) => {
        if (typeof (searchTerm) == "string" && typeof (basedOn) == "string") {
            if (basedOn === "username") {
                User.findByUsername(searchTerm)
                    .then((user) => {
                        user = {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            faculty: user.faculty,
                            semester: user.semester,
                            roles: user.roles,
                            isApproved: user.isApproved,
                            isSubscriptionExpired: user.isSubscriptionExpired,
                            joinedOn: {
                                date: user.joinedOn.getDate(),
                                month: user.joinedOn.getMonth(),
                                year: user.joinedOn.getFullYear()
                            }
                        }
                        resolve(user);
                    })
                    .catch((err) => reject(err));
            }
            else if (basedOn === "faculty") {
                User.findByFaculty(searchTerm)
                    .then((users) => {
                        resolve(users);
                    })
                    .catch((error) => reject(error));
            }
        }
        else {
            reject("the value is not of type 'string'");
        }
    })

}

Admin.findAndApproveOne = (userId) => {
    userId = new ObjectID(userId);
    console.log(userId);
    //update the isApproved field
    return new Promise((resolve, reject) => {
        userCollection.updateOne(
            { _id: userId },
            { $set: { isApproved: true } }
        ).then(() => {
            sessionCollection.deleteOne({ userId: userId });
            resolve("updated successfully");
        })
            .catch((error) => reject(error));
    })
}
Admin.findAndDisapproveOne = (userId) => {
    userId = new ObjectID(userId);
    //update the isApproved field
    return new Promise((resolve, reject) => {
        userCollection.updateOne(
            { _id: userId },
            { $set: { isApproved: false } }
        ).then(() => {
            sessionCollection.deleteOne({ userId: userId });
            resolve("disapproved successfully");
        })
            .catch((error) => console.log(error));
    })
}

Admin.findAndMakeContributor = (userId) => {
    userId = new ObjectID(userId);

    return new Promise((resolve, reject) => {
        userCollection.findOneAndUpdate(
            { _id: userId },
            { $push: { roles: "contributor" } }
        ).then((recentContributor) => {
            if (recentContributor.value) resolve({
                _id: recentContributor.value._id,
                username: recentContributor.value.username
            });
            else reject("while adding contributor: no match found for that id");
        })
            .catch((error) => reject(error));
    })
}
Admin.findAndRemoveContributor = (userId) => {
    userId = new ObjectID(userId);
    return new Promise((resolve, reject) => {
        userCollection.findOneAndUpdate(
            { _id: userId },
            { $pull: { roles: "contributor" } }
        ).then((recentContributor) => {
            if (recentContributor.value) resolve({
                _id: recentContributor.value._id,
                username: recentContributor.value.username
            });
            else reject("while removing contributor: no match found for that id");
        })
            .catch((error) => reject(error));
    })
}


module.exports = Admin;