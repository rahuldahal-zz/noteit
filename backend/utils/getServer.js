require("dotenv").config();

exports.server =
  process.env.NODE_ENV === "production"
    ? "https://mynoteit.herokuapp.com"
    : "http://localhost:5000";
