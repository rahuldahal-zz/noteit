const { currentTask } = require("../../getCurrentTask");

module.exports = async function (collectionNames) {
  if (["test", "test-watch"].includes(currentTask)) {
    return null;
  } else {
    try {
      const client = require("../../db")(true);
      collectionNames = collectionNames.map((name) =>
        client.db().collection(name)
      );
      return collectionNames;
    } catch (error) {
      console.log(error);
    }
  }
};
