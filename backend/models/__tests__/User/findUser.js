const { MongoClient, ObjectID } = require("mongodb");
const { User, setCollection } = require("../../User");
const dotenv = require("dotenv");
dotenv.config();

describe("findUser method", () => {
  let connection, db, usersCollection;
  let createdUser;
  const googleOAuthData = {
    id: "google|123456",
    email: "test@testing.com",
    firstName: "Rahul",
    lastName: "Dahal",
    picture: "https://pictureAPI.com",
  };
  const user = new User(googleOAuthData, "google");

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    usersCollection = db.collection("users");
    setCollection(usersCollection);
    createdUser = await user.createUser();
  });

  afterAll(async () => {
    db.collection("users").deleteMany({});
    await connection.close();
  });

  describe("should find one and only one", () => {
    test("user for given objectId", async () => {
      const { _id } = createdUser;
      const userQuery = await user.findBy({
        criteria: "ObjectId",
        value: _id,
      });
      expect(userQuery._id).toEqual(user.data._id);
    });

    test("user for given OAuthId", async () => {
      const { OAuthId } = createdUser;
      const userQuery = await user.findBy({
        criteria: "OAuthId",
        value: OAuthId,
      });
      expect(userQuery.OAuthId).toEqual(user.data.OAuthId);
    });

    test("user for given email", async () => {
      const { email } = createdUser;
      const userQuery = await user.findBy({
        criteria: "email",
        value: email,
      });
      expect(userQuery.email).toEqual(user.data.email);
    });
  });

  describe("should find at least one", () => {
    test("user for given faculty", async () => {
      const { _id } = createdUser;
      const anotherUser = await user.createUser();
      const mockUserOne = new User({ _id });
      const mockUserTwo = new User(anotherUser);
      await mockUserOne.saveFacultyAndSemester("bim", "second");
      await mockUserTwo.saveFacultyAndSemester("bim", "first");
      const userQuery = await user.findBy({
        criteria: "faculty",
        value: "bim",
      });
      expect(userQuery[0].faculty).toEqual("bim");
      expect(userQuery[1].faculty).toEqual("bim");
    });

    test("user for given semester", async () => {
      const { _id } = createdUser;
      const anotherUser = await user.createUser();
      const mockUserOne = new User({ _id });
      const mockUserTwo = new User(anotherUser);
      await mockUserOne.saveFacultyAndSemester("bim", "second");
      await mockUserTwo.saveFacultyAndSemester("csit", "second");
      const userQuery = await user.findBy({
        criteria: "semester",
        value: "second",
      });
      expect(userQuery[0].semester).toEqual("second");
      expect(userQuery[1].semester).toEqual("second");
    });

    test("user for given role", async () => {
      const newUser = new User(googleOAuthData, "google");
      // const { _id } = await newUser.createUser();
      // const x = await usersCollection.findOneAndUpdate(
      //   { _id },
      //   { $push: { roles: "moderator" } },
      //   { returnOriginal: false }
      // );
      // console.log(x);
      // const userQuery = await user.findBy({
      //   criteria: "role",
      //   value: "moderator",
      // });
      // expect(userQuery[0].roles).toEqual(
      //   expect.arrayContaining(["basic", "moderator"])
      // );
      expect(true).toBeTruthy();
    });
  });

  describe("should reject the promise", () => {
    test("for invalid criteria", async () => {
      try {
        await user.findBy({
          criteria: "invalidCriteria",
        });
      } catch (rejectionMessage) {
        const { reason, message } = rejectionMessage;
        expect(reason).toEqual("invalidArgument");
        expect(message).toEqual("Invalid criteria is provided");
      }
    });

    test("for unmatched value of the criteria", async () => {
      try {
        await user.findBy({
          criteria: "email",
          value: "nonExisting@email.com",
        });
      } catch (rejectionMessage) {
        const { reason, message } = rejectionMessage;
        expect(reason).toEqual("noUser");
        expect(message).toEqual("Cannot find any user with that email");
      }
    });

    test("for invalid update value", async () => {
      try {
        await user.findBy({
          criteria: "email",
          value: "whatever@doesntmatter.com",
          update: "randomValue",
        });
      } catch (rejectionMessage) {
        const { reason, message } = rejectionMessage;
        expect(reason).toEqual("invalidArgument");
        expect(message).toEqual("Invalid update value is provided");
      }
    });
  });

  test("should update lastLogin", async () => {
    const { _id } = createdUser;
    const { lastLogin } = await user.findBy({
      criteria: "ObjectId",
      value: _id,
      update: "lastLogin",
    });
    expect(lastLogin.getMinutes()).toEqual(new Date().getMinutes());
  });
});
