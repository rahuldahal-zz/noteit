// restricting CORS to only specified domain

const whiteListDomains = [
  process.env.ALLOWED_ORIGIN_EDITOR,
  process.env.ALLOWED_ORIGIN_LOCAL,
  process.env.ALLOWED_ORIGIN_PRODUCTION,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteListDomains.indexOf(origin) !== -1 || !origin) {
      // the !origin allows tools like "postman" to send the request
      callback(null, true); // yes, they are allowed
    } else {
      console.log("Requested by origin: " + origin);
      callback(new Error("Not allowed by express-CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
