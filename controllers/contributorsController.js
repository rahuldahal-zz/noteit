const jwt = require("jsonwebtoken");
const Contributors = require("../models/Contributors");
const Follow = require("../models/Follow");
const Contributor = require("../models/Contributors");
const reusable = require("./reusableFunctions");
const sendGrid = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");

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
  const {details, note, payload} = req.body; /* contributor === req.payload */
  console.log(`${payload.contributor.name} has submitted "${details.title}"`);
  if (typeof req.body !== "string") {
    return reusable.respond(400, "Unacceptable value type received", res);
  }

  // create file and put the body

  // create the directory first if it doesn't exist
  const absoluteDir = path.join(__dirname, "../contributedNotes");

  fs.mkdir(absoluteDir, { recursive: true }, (err) => {
    if (err) throw new Error(err);

    // if no error, write new file
    createFile();
  });

  function createFile() {
    fs.writeFile(
      `${absoluteDir.toString()}/${payload.contributor.name}.html`,
      body,
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        afterFileCreation(
          res,
          {payload, details},
          `${absoluteDir.toString()}/${payload.contributor.name}.html`
        );
      }
    );
  }
};

function afterFileCreation(res, {payload, details}, attachment) {

  const {unit, title, subject, faculty, semester} = details;

  sendGrid.setApiKey(process.env.SENDGRID_API);

  attachmentEncoded = fs.readFileSync(attachment).toString("base64");

  const message = {
    to: process.env.ADMIN_MAIL,
    from: "noteitteam@gmail.com",
    subject: `${payload.contributor.name} has submitted a new note.`,
    text: `unit no. ${unit} titled "${title}" of "${subject}" subject for ${semester} semester, ${faculty}.`,
    attachments: [
      {
        content: attachmentEncoded,
        filename: `${unit}_${subject}_${semester}_${faculty}.html`,
        type: "text/html",
        disposition: "attachment",
      },
    ],
  };

  console.log("runs");

  sendGrid
    .send(message)
    .then(() => {
      fs.unlink(attachment, (err) => {
        if (err) return res.status(500).send(err);

        res.status(202).send("Ouu yeah, the file is created.");
      });
    })
    .catch((error) => res.status(500).send(error));
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
