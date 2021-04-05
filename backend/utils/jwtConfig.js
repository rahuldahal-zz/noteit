const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signToken = function signToken({ payload, admin = false }) {
  const SECRET = admin
    ? process.env.JWT_SECRET_ADMIN
    : process.env.JWT_SECRET_USER;
  return jwt.sign(payload, SECRET, {
    expiresIn: "20s",
  });
};

exports.signRefreshToken = function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_USER_REFRESH, {
    expiresIn: "1d",
  });
};

exports.verifyRefreshToken = function verifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_USER_REFRESH, (err, payload) => {
      if (err) {
        return reject(err);
      }
      return resolve(payload);
    });
  });
};

exports.verifyToken = function verifyToken({ token, admin = false }) {
  return new Promise((resolve, reject) => {
    const SECRET = admin
      ? process.env.JWT_SECRET_ADMIN
      : process.env.JWT_SECRET_USER;
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return reject(err);
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
