// need to work on this...

const throwError = function (status, message, res) {
  const error = new Error(message);
  error.status = status.toString();

  // this middle-ware sends the error to the client
  switch (error.status) {
    case "400":
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
  if (req.flash) {
    req.flash(collection, message);
    req.session.save(() => res.redirect(redirectURL));
  } else throwError(400, message, res);
};

exports.log = function (message) {
  const caller = log.caller;
  if (!caller) console.log(`from ROOT: ${message}`);
  else console.log(`from ${caller}: ${message}`);
};

exports.throwError = throwError;
