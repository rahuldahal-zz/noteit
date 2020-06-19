const contributorsCollection = require("../db").db().collection("contributors");
const ObjectID = require("mongodb").ObjectID;

let Contributor = function (data) {
    this.data = data;
    this.errors = [];
}


Contributor.addOne = function (recentlyAddedContributor) {
    //userId is the "_id" from usersCollection

    this.data = {
        userId: recentlyAddedContributor._id,
        username: recentlyAddedContributor.username,
        recentContribution: null,
        contacts: {
            facebookProfileUrl: null,
            twitterProfileUrl: null,
            githubProfileUrl: null,
            websiteProfileUrl: null
        }
    }
    return new Promise((resolve, reject) => {
        contributorsCollection.insertOne(this.data)
            .then((contributor) => resolve(contributor.ops[0]))
            .catch((error) => reject(error));
    })
}

Contributor.removeOne = function (userId) {
    return new Promise((resolve, reject) => {
        contributorsCollection.deleteOne({ userId: new ObjectID(userId) })
            .then(() => resolve())
            .catch((error) => reject(error));
    })
}

Contributor.getOne = function (username) {
    return new Promise((resolve, reject) => {
        //aggregate operation
        contributorsCollection.aggregate([
            { $match: { username: username } },
            {
                $lookup: {
                    from: "notes",
                    localField: "userId",
                    foreignField: "contributor",
                    as: "contributions"
                }
            },
            {
                $project: {
                    userId: 1,
                    username: 1,
                    contacts: 1,
                    recentContribution: 1,
                    contributions: 1
                }
            }
        ]).toArray()
            .then((requestedContributor) => {
                if (requestedContributor.length) {
                    //cleaning up the contributed notes for each contribution of each contributor
                    requestedContributor.forEach((contributor) => {
                        contributor.contributions = contributor.contributions.map(contribution => {
                            contribution = {
                                unitNo: contribution.unitNo,
                                title: contribution.title,
                                subject: contribution.subject,
                                faculty: contribution.faculty,
                                semester: contribution.semester,
                                url: contribution.url,
                                createdDate: contribution.createdDate,
                            }
                            return contribution;
                        })
                    })
                    resolve(requestedContributor[0]);
                }
                else reject(`"${username}" is not a contributor`);
            })
            .catch((error) => reject(error));
    })
}

Contributor.editContacts = function (data) {
    let { contributorId, facebookProfileUrl, twitterProfileUrl, githubProfileUrl, websiteProfileUrl } = data;
    let contacts = {
        facebookProfileUrl: facebookProfileUrl,
        twitterProfileUrl: twitterProfileUrl,
        githubProfileUrl: githubProfileUrl,
        websiteProfileUrl: websiteProfileUrl
    };
    return new Promise((resolve, reject) => {
        if (typeof facebookProfileUrl !== "string" ||
            typeof twitterProfileUrl !== "string" ||
            typeof githubProfileUrl !== "string" ||
            typeof websiteProfileUrl !== "string"
        ) {
            return reject("the data is not a string");
        }
        contributorsCollection.findOneAndUpdate(
            { _id: new ObjectID(contributorId) },
            { $set: { contacts: contacts } }
        )
            .then((response) => resolve(response.value))
            .catch((error) => console.log(error));
    })
}

module.exports = Contributor;