const jwt = require("jsonwebtoken");
const { Contributor } = require("@models/Contributors");
const { Follow } = require("@models/Follow");
const sendGrid = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");

exports.showContributorScreen = (req, res) => {
  res.renderTemplate("index", { toRender: "contributors/contributor-screen" });
};

exports.getAll = (req, res) => {
  Contributor.getAll()
    .then((response) => res.status(200).json(response))
    .catch((error) => res.send(error));
};

exports.getOne = (req, res) => {
  Contributor.getOne(req.params.username)
    .then((response) => {
      response.isVisitorTheRequestedContributor = false;
      if (req.user) {
        if (req.user._id.toString() === response.userId.toString())
          response.isVisitorTheRequestedContributor = true;

        //check if the visitor is following the requested contributor

        Follow.isVisitorFollowing(response._id, req.user._id)
          .then(() => {
            response.isVisitorFollowing = true;
            res.renderTemplate("index", {
              toRender: "contributors/contributor-profile",
              data: {
                contributor: response,
              },
            });
          })
          .catch(() => {
            response.isVisitorFollowing = false;
            res.renderTemplate("index", {
              toRender: "contributors/contributor-profile",
              data: {
                contributor: response,
              },
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
