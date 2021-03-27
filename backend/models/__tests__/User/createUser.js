const { MongoClient } = require("mongodb");
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

  const additionalDefaults = {
    _id: expect.any(require("mongodb").ObjectID),
    provider: expect.stringMatching(/(facebook)?(google)?/),
    faculty: null,
    semester: null,
    isSubscriptionExpired: false,
    joinedOn: expect.any(Date),
    lastLogin: expect.any(Date),
    roles: ["basic"],
    savedNotes: [],
    sessionCount: 0,
  };

  test("should insert an user with user data", async () => {
    const userDataFromAuthProvider = {
      id: "google|123456",
      email: "test@testing.com",
      firstName: "Rahul",
      lastName: "Dahal",
      picture: "https://pictureAPI.com",
    };

    const newUser = await new User(userDataFromAuthProvider, "google").create();

    expect(newUser).toEqual({
      OAuthId: userDataFromAuthProvider.id,
      email: userDataFromAuthProvider.email,
      picture: userDataFromAuthProvider.picture,
      firstName: userDataFromAuthProvider.firstName,
      lastName: userDataFromAuthProvider.lastName,
      ...additionalDefaults,
    });
  });

  test("should reject for bogus property", async () => {
    const bogusData = {
      bogusProp: "hahaha",
      id: "google|123456",
      email: "test@testing.com",
      firstName: "Rahul",
      lastName: "Dahal",
      picture: "https://pictureAPI.com",
    };

    try {
      await new User(bogusData, "google").create();
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual(
        expect.arrayContaining(["bogus property bogusProp received"])
      );
    }
  });

  test("should reject for non-string value", async () => {
    const invalidData = {
      id: "google|123456",
      email: () => null,
      firstName: "Rahul",
      lastName: "Dahal",
      picture: "https://pictureAPI.com",
    };

    try {
      await new User(invalidData, "google").create();
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual(
        expect.arrayContaining(["unacceptable value type on email property"])
      );
    }
  });
});
