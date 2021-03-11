const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signToken = function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

exports.verifyToken = function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
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
