const { currentTask } = require("../../getCurrentTask");

module.exports = async function (collectionNames) {
  if (["test", "test-watch"].includes(currentTask)) {
    return null;
  } else {
    try {
      const db = require("../../db");
      const client = await db;
      collectionNames = collectionNames.map((name) =>
        client.db().collection(name)
      );
      console.log("collection names", collectionNames[0]);
      return collectionNames;
    } catch (error) {
      console.log(error);
    }
  }
};
