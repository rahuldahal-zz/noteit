const mongodb = require("mongodb");
const { currentTask } = require("./getCurrentTask");
const dotenv = require("dotenv");
dotenv.config();

module.exports = new Promise((resolve, reject) => {
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
});
