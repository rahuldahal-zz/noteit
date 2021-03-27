const mongodb = require("mongodb");
require("dotenv").config();

let clientReference = null;

module.exports = function returnClient(returnClientOnly) {
  if (returnClientOnly) {
    return clientReference;
  }

  return mongodb.connect(
    process.env.CONNECTIONSTRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.log(err);
        console.log("Cannot connect to MongoDB");
        return;
      }

      clientReference = client;

      //   start the express app
      const app = require("./app");
      app.listen(process.env.PORT, () =>
        console.log(`app is now listening on ${process.env.PORT}`)
      );
    }
  );
};
