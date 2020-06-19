const Follow = require("../models/Follow");

exports.addFollow = (req, res) => {
    let follow = new Follow(req.params.contributorId, req.session.user._id);

    follow.create()
        .then(() => {
            res.status(200).send("success");
        })
        .catch((error) => {
            console.log(error);
        })
}

exports.removeFollow = (req, res) => {
    let follow = new Follow(req.params.contributorId);

    follow.remove()
        .then(() => {
            res.statue(200).send("success");
        })
        .catch((error) => {
            console.log(error);
        })
}