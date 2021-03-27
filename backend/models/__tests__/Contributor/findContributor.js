const { MongoClient, ObjectID } = require("mongodb");
const { Contributor, setCollection } = require("../../Contributors");
const dotenv = require("dotenv");
dotenv.config();

describe("findContributor method", () => {
  let connection, db, contributorsCollection;
  let createdUser;
  const googleOAuthData = {
    id: "123456GoogleID",
    email: "test@testing.com",

    firstName: "Rahul",
    lastName: "Dahal",
    picture: "https://pictureAPI.com",
  };
  const contributor = new Contributor(googleOAuthData, "google");

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    contributorsCollection = db.collection("contributors");
    setCollection(contributorsCollection);
    // createdContributor = await contributor.create();
  });

  afterAll(async () => {
    db.collection("contributors").deleteMany({});
    await connection.close();
  });

  //   describe("should find one and only one", () => {
  //     test("user for given objectId", async () => {
  //       const { _id } = createdUser;
  //       const userQuery = await user.findBy({
  //         criteria: "ObjectId",
  //         value: _id,
  //       });
  //       expect(userQuery._id).toEqual(user.data._id);
  //     });

  //     test("user for given OAuthId", async () => {
  //       const { OAuthId } = createdUser;
  //       const userQuery = await user.findBy({
  //         criteria: "OAuthId",
  //         value: OAuthId,
  //       });
  //       expect(userQuery.OAuthId).toEqual(user.data.OAuthId);
  //     });

  //     test("user for given email", async () => {
  //       const { email } = createdUser;
  //       const userQuery = await user.findBy({
  //         criteria: "email",
  //         value: email,
  //       });
  //       expect(userQuery.email).toEqual(user.data.email);
  //     });
  //   });

  describe("should reject the promise", () => {
    test("for invalid criteria", async () => {
      try {
        await contributor.findBy({
          criteria: "invalidCriteria",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid criteria is provided");
      }
    });

    test("for unmatched value of the criteria", async () => {
      try {
        await contributor.findBy({
          criteria: "email",
          value: "nonExisting@email.com",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual(
          "Cannot find any contributor with that email"
        );
      }
    });

    test("for invalid update value", async () => {
      try {
        await contributor.findBy({
          criteria: "email",
          value: "whatever@doesntmatter.com",
          update: "randomValue",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid update value is provided");
      }
    });
  });
});
