const { MongoClient, ObjectID } = require("mongodb");
const { User, setCollection } = require("../../User");
const dotenv = require("dotenv");
dotenv.config();

describe("findUser method", () => {
  let connection, db, usersCollection;
  let createdUser;
  const googleOAuthData = {
    sub: "123456GoogleID",
    email: "test@testing.com",
    name: "Rahul Dahal",
    given_name: "Rahul",
    family_name: "Dahal",
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
      expect(userQuery.length).toBe(1);
      expect(userQuery[0]._id).toEqual(user.data._id);
    });

    test("user for given OAuthId", async () => {
      const { OAuthId } = createdUser;
      const userQuery = await user.findBy({
        criteria: "OAuthId",
        value: OAuthId,
      });
      expect(userQuery.length).toBe(1);
      expect(userQuery[0].OAuthId).toEqual(user.data.OAuthId);
    });

    test("user for given email", async () => {
      const { email } = createdUser;
      const userQuery = await user.findBy({
        criteria: "email",
        value: email,
      });
      expect(userQuery.length).toBe(1);
      expect(userQuery[0].email).toEqual(user.data.email);
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
      const { _id } = await user.createUser();
      await usersCollection.findOneAndUpdate(
        { _id },
        { $push: { roles: "moderator" } }
      );
      const userQuery = await user.findBy({
        criteria: "role",
        value: "moderator",
      });
      expect(userQuery[0].roles).toEqual(
        expect.arrayContaining(["basic", "moderator"])
      );
    });
  });

  describe("should reject the promise", () => {
    test("for invalid criteria", async () => {
      try {
        await user.findBy({
          criteria: "invalidCriteria",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid criteria is provided");
      }
    });

    test("for unmatched value of the criteria", async () => {
      try {
        await user.findBy({
          criteria: "email",
          value: "nonExisting@email.com",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual(
          "Cannot find any user with that email"
        );
      }
    });
  });
});
