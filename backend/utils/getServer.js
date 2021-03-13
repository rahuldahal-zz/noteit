require("dotenv").config();

exports.server =
  process.NODE_ENV === "production"
    ? "https://mynoteit.herokuapp.com"
    : "http://localhost:5000";
