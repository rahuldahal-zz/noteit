const { User } = require("@models/User");
const passport = require("passport");
const getSubObject = require("@utils/getSubObject");
const { signToken, verifyRefreshToken } = require("@utils/jwtConfig");
const { server } = require("@utils/getServer");

async function updateRefreshToken(_id) {
  try {
    return await User.prototype.updateRefreshToken(_id);
  } catch (error) {
    return error;
  }
}

exports.root = async (req, res) => {
  const responsePrototype = {
    isAuthenticated: false,
    isNewUser: false,
    accessToken: null,
    refreshToken: null,
  };

  if (!req.user) {
    res.status(401);
    return res.json(responsePrototype);
  }

  // user is Authenticated

  try {
    await verifyRefreshToken(req.user.refreshToken);
    console.log("refresh token is not expired");

    responsePrototype.refreshToken = req.user.refreshToken;
  } catch (error) {
    console.log(error.message);
    if (error.message === "jwt expired") {
      const updatedRefreshToken = updateRefreshToken(req.user._id);
      if (typeof updateRefreshToken === "object") {
        res.status(500);
        return res.end();
      }
      responsePrototype.refreshToken = updatedRefreshToken;
    }
  } finally {
    console.log("sending user data...");
    const propertiesToReturn = [
      "_id",
      "email",
      "firstName",
      "lastName",
      "picture",
      "savedNotes",
    ];
    const payload = getSubObject(req.user, propertiesToReturn);
    const signedToken = signToken({ payload });
    responsePrototype.isAuthenticated = true;
    responsePrototype.accessToken = signedToken;
    responsePrototype.isAdmin = req.user.roles.includes("admin");

    if (!req.user.faculty || !req.user.semester) {
      responsePrototype.isNewUser = true;
    }

    res.status(200);
    res.json(responsePrototype);
  }
};

exports.google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.facebook = passport.authenticate("facebook");

exports.callback = (req, res) => res.redirect(`${server}/`);

exports.logout = (req, res) => {
  console.log("logging out");
  User.prototype
    .sessionCountHandler(req.user._id, "decrement")
    .then(() => {
      req.logout();
      req.session = null;
      req.user = null;
      res.status(204).end();
    })
    .catch((err) => console.log("from logout: " + err));
};
