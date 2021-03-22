const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signToken = function signToken({ payload, admin = false }) {
  const SECRET = admin
    ? process.env.JWT_SECRET_ADMIN
    : process.env.JWT_SECRET_USER;
  return jwt.sign(payload, SECRET, {
    expiresIn: "10m",
  });
};

exports.verifyToken = function verifyToken({ token, admin = false }) {
  return new Promise((resolve, reject) => {
    const SECRET = admin
      ? process.env.JWT_SECRET_ADMIN
      : process.env.JWT_SECRET_USER;
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return reject({
          isAuthorized: false,
          payload: null,
        });
      }

      return resolve({
        isAuthorized: true,
        payload,
      });
    });
  });
};

exports.getTokenFromHeader = function getTokenFromHeader(req) {
  const { authorization } = req.headers;
  if (!authorization) {
    return null;
  }
  return authorization.split(" ")[1];
};
