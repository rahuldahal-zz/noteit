// need to work on this...

exports.throwError = function (status, message, res) {
  const error = new Error(message);
  error.status = status.toString();

  // this middle-ware sends the error to the client
  switch (error.status) {
    case "401":
    case "403":
    case "500":
      return res.status(error.status).json({ errorMessage: error.message });
    case "404":
      return res.status(error.status).render("404");
    case "429":
      return res.status(error.status).redirect("/home");
  }
};

exports.sendFlashMessage = function (
  req,
  res,
  collection,
  message,
  redirectURL
) {
  req.flash(collection, message);
  req.session.save(() => res.redirect(redirectURL));
};

exports.log = function (message) {
  const caller = log.caller;
  if (!caller) console.log(`from ROOT: ${message}`);
  else console.log(`from ${caller}: ${message}`);
};
