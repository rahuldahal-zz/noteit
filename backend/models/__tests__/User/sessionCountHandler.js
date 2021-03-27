const { MongoClient, ObjectID } = require("mongodb");
const { User, setCollection } = require("../../User");
require("dotenv").config();

describe("create", () => {
  let connection;
  let db;
  let usersCollection;

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    usersCollection = db.collection("users");
    setCollection(usersCollection);
  });

  afterAll(async () => {
    db.collection("users").deleteMany({});
    await connection.close();
  });

  const googleOAuthData = {
    id: "123456GoogleID",
    email: "test@testing.com",

    firstName: "Rahul",
    lastName: "Dahal",
    picture: "https://pictureAPI.com",
  };

  const user = new User(googleOAuthData, "google");

  test("should resolve by increasing or decreasing the sessionCount", async () => {
    const { _id } = await user.create();
    const incrementedDoc = await user.sessionCountHandler(_id, "increment");
    const decrementedDoc = await user.sessionCountHandler(_id, "decrement");
    expect(incrementedDoc.sessionCount).toEqual(1);
    expect(decrementedDoc.sessionCount).toEqual(0);
  });

  // rejections

  test("should reject for invalid ObjectID", async () => {
    try {
      const newUser = new User(googleOAuthData, "google");
      await newUser.create();
      await newUser.sessionCountHandler("abcInvalidID", "decrement");
    } catch (rejectionMessage) {
      expect(rejectionMessage.message).toEqual("Invalid ObjectID is provided.");
    }
  });

  test("should reject for invalid action", async () => {
    try {
      const newUser = new User(googleOAuthData, "google");
      const { _id } = await newUser.create();
      await newUser.sessionCountHandler(_id, "invalidArgument");
    } catch (rejectionMessage) {
      expect(rejectionMessage.message).toEqual(
        "Invalid action is provided. Only increment and decrement are accepted."
      );
    }
  });

  test("should reject for unmatched ObjectID", async () => {
    try {
      const newUser = new User(googleOAuthData, "google");
      await newUser.create();
      await newUser.sessionCountHandler(new ObjectID(), "increment");
    } catch (rejectionMessage) {
      expect(rejectionMessage.message).toEqual("Cannot find the user");
    }
  });
});
