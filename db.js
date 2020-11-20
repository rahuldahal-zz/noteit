const mongodb = require("mongodb");
const { currentTask } = require("./getCurrentTask");
const dotenv = require("dotenv");
dotenv.config();

module.exports = new Promise((resolve, reject) => {
  if (currentTask !== "test") {
    mongodb.connect(
      process.env.CONNECTIONSTRING,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) {
          return reject("Cannot connect to MongoDB");
        }
        // returns the db client, (the whole db)
        resolve(client);

        //   start the express app
        const app = require("./app");
        app.listen(process.env.PORT, () =>
          console.log(`app is now listening on ${process.env.PORT}`)
        );
      }
    );
  } else {
    console.log("mock db is called");
    mongodb.connect(
      process.env.TEST_CONNECTIONSTRING,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        module.exports = client;
      }
    );
  }
});
