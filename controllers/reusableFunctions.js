// need to work on this...

const respond = function (status, message, res) {
  status = status.toString();

  // this middle-ware sends the error to the client
  switch (status) {
    case "200":
    case "201":
    case "202":
      return res.status(status).json({ success: message });
    case "400":
    case "401":
    case "403":
    case "500":
      return res.status(status).json({ error: message });
    case "404":
      return res.status(status).renderTemplate("index", {toRender: "404"});
    case "429":
      return res.status(status).redirect("/home");
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
  } else respond(400, message, res);
};

exports.respond = respond;

