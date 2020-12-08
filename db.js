const mongodb = require("mongodb");
const { currentTask } = require("./getCurrentTask");
const dotenv = require("dotenv");
dotenv.config();

let clientReference = null;

module.exports = function (returnClientOnly) {
  if (returnClientOnly) {
    return clientReference;
  }

  return mongodb.connect(
    process.env.CONNECTIONSTRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return reject("Cannot connect to MongoDB");
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
