const jwt = require("jsonwebtoken");
const Contributors = require("../models/Contributors");
const Follow = require("../models/Follow");
const Contributor = require("../models/Contributors");
const reusable = require("./reusableFunctions");
const sendGrid = require("@sendgrid/mail");
const fs = require("fs");

exports.showContributorScreen = (req, res) => {
  res.render("contributors/contributor-screen");
};

exports.getAll = (req, res) => {
  Contributor.getAll()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.send(error));
};

exports.getOne = (req, res) => {
  Contributors.getOne(req.params.username)
    .then((response) => {
      response.isVisitorTheRequestedContributor = false;
      if (req.user) {
        if (req.user._id.toString() === response.userId.toString())
          response.isVisitorTheRequestedContributor = true;

        //check if the visitor is following the requested contributor

        Follow.isVisitorFollowing(response._id, req.user._id)
          .then(() => {
            response.isVisitorFollowing = true;
            res.render("contributors/contributor-profile", {
              contributor: response,
            });
          })
          .catch(() => {
            response.isVisitorFollowing = false;
            res.render("contributors/contributor-profile", {
              contributor: response,
            });
          });
      }
    })
    .catch((error) => {
      req.flash("errors", error);
      req.session.save(() => {
        if (req.session.user) res.redirect("/home");
        else res.redirect("/");
      });
    });
};

exports.isContributorAlreadyRegistered = (req, res, next) => {
  let contributor = new Contributor(req.body);
  contributor
    .findByOAuthId()
    .then((contributor) => {
      if (contributor && contributor.isApproved) {
        const message = jwt.sign(
          { contributor: { _id: contributor._id, name: contributor.name } },
          process.env.JWTSECRET,
          {
            expiresIn: "30m",
          }
        );
        return reusable.respond(202, message, res);
      } else return reusable.respond(200, "Wait for Approval", res);
    })
    .catch((error) => {
      if (error === "not found") {
        req.contributorObject = contributor; // making that "let contributor = new Contributor() available to the next middleware"
        return next();
      } else reusable.respond("500", error, res);
    });
};

exports.create = (req, res) => {
  req.contributorObject
    .create()
    .then(() =>
      reusable.respond(201, "Contributor is created, Wait for approval.", res)
    )
    .catch((error) => console.log(error));
};

exports.createNoteFileAndMail = (req, res) => {
  const body = req.body.note;
  console.log(req.payload);
  if (typeof body !== "string") {
    return reusable.respond(400, "Unacceptable value type received", res);
  }

  // create file and put the body
  console.log("\nDir name: " + __dirname);
  fs.writeFile(
    `${__dirname}/${req.payload.contributor.name}.html`,
    body,
    (err) => {
      if (err) {
        return reusable.respond(400, "Unacceptable value type received", res);
      }
      return afterFileCreation(res);
    }
  );
  res.send("Done");
};

function afterFileCreation(res) {
  res
    .status(202)
    .send("Ouu yeah, the file is created.\n Now send it via email");
}

exports.remove = (req, res) => {
  if (!req.recentlyRemovedContributor) {
    res
      .status(500)
      .send(
        "inside contributorsController, 'req.recentlyRemovedContributor' is undefined"
      );
    return;
  }
  Contributors.removeOne(req.recentlyRemovedContributor._id)
    .then(() => res.send("success"))
    .catch((error) => console.log(error));
};

exports.editContacts = (req, res) => {
  Contributors.editContacts(req.body)
    .then((editedProfile) => res.status(201).send(editedProfile))
    .catch((error) => res.send(error));
};
