let request, response;

/**
 *
 * @description Exposes request and response objects to sendFlashMessage
 */
exports.initializeFlashHelper = function (req, res, next) {
  request = req;
  response = res;
  next();
};

exports.sendFlashMessage = function ({ collection, message, redirectURL }) {
  if (request.flash) {
    request.flash(collection, message);
    request.session.save(() => response.redirect(redirectURL));
  } else {
    console.log("flash message middleware is not set on request object.");
  }
};
