const { MongoClient, ObjectID } = require("mongodb");
const { User } = require("../../User");
const setCollectionForUser = require("../../User").setCollection;
const { Admin, setCollection } = require("../../Admin");

describe("handleUserApproval method", () => {
  let connection, db, userCollection, sessionCollection;
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
  const admin = new Admin();

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    userCollection = db.collection("users");
    sessionCollection = db.collection("session");
    setCollectionForUser(userCollection);
    setCollection({ userCollection, sessionCollection });
    createdUser = await user.createUser();
  });

  afterAll(async () => {
    db.collection("users").deleteMany({});
    await connection.close();
  });

  describe("should resolve by", () => {
    test("approving the user", async () => {
      const { _id } = createdUser;
      const { isApproved } = await admin.handleUserApproval({
        userId: _id,
      });
      expect(isApproved).toBe(true);
    });

    test("disapproving the user", async () => {
      const { _id } = createdUser;
      const { isApproved } = await admin.handleUserApproval({
        userId: _id,
        action: "disapprove",
      });
      expect(isApproved).toBe(false);
    });
  });

  describe("should reject for", () => {
    test("invalid ObjectID", async () => {
      try {
        await admin.handleUserApproval({
          userId: "invalidObjectId",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid ObjectID is provided");
      }
    });

    test("invalid action", async () => {
      try {
        await admin.handleUserApproval({
          userId: new ObjectID(),
          action: "invalidArgument",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid action is provided");
      }
    });

    test("unmatched user", async () => {
      try {
        await admin.handleUserApproval({
          userId: new ObjectID(),
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("The user was not found");
      }
    });
  });
});
