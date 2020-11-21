const { MongoClient, ObjectID } = require("mongodb");
const { User, setCollection } = require("../../User");
const dotenv = require("dotenv");
dotenv.config();

describe("createUser", () => {
  let connection, db, usersCollection;

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

  const additionalDefaults = {
    _id: expect.any(require("mongodb").ObjectID),
    provider: expect.stringMatching(/(facebook)?(google)?/),
    faculty: null,
    semester: null,
    isApproved: false,
    isSubscriptionExpired: false,
    joinedOn: expect.any(Date),
    lastLogin: expect.any(Date),
    roles: ["basic"],
    savedNotes: [],
    sessionCount: 0,
  };

  const googleOAuthData = {
    sub: "123456GoogleID",
    email: "test@testing.com",
    name: "Rahul Dahal",
    given_name: "Rahul",
    family_name: "Dahal",
    picture: "https://pictureAPI.com",
  };

  const user = new User(googleOAuthData, "google");

  test("should resolve by increasing the sessionCount", async () => {
    const { _id } = await user.createUser();
    const message = await user.sessionCountHandler(_id, "increment");
    expect(message).toEqual("Successfully Incremented sessionCount");
  });

  test("should resolve by decreasing the sessionCount", async () => {
    const { _id } = await user.createUser();
    const message = await user.sessionCountHandler(_id, "decrement");
    expect(message).toEqual("Successfully Decremented sessionCount");
  });

  test("should reject for invalid ObjectID", async () => {
    try {
      await user.createUser();
      await user.sessionCountHandler("abcInvalidID", "decrement");
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual("Invalid ObjectID is provided.");
    }
  });

  test("should reject for invalid action", async () => {
    try {
      const { _id } = await user.createUser();
      await user.sessionCountHandler(_id, "invalidArgument");
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual(
        "Invalid action is provided. Only increment and decrement are accepted."
      );
    }
  });

  test("should reject for unmatched ObjectID", async () => {
    try {
      await user.createUser();
      await user.sessionCountHandler(new ObjectID(), "increment");
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual("Cannot find the user");
    }
  });
});
