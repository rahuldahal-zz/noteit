const { MongoClient, ObjectID } = require("mongodb");
const { Contributor } = require("../../Contributors");
const setCollectionForContributor = require("../../Contributors").setCollection;
const { Admin, setCollection } = require("../../Admin");

describe("handleContributorApproval method", () => {
  let connection, db, contributorsCollection;
  let createdContributor;
  const facebookOAuthData = {
    id: "123456FacebookID",
    email: "test@testing.com",
    name: "Rahul Dahal",
    first_name: "Rahul",
    last_name: "Dahal",
    picture: {
      data: {
        url: "https://pictureAPI.com",
      },
    },
  };
  const contributor = new Contributor(facebookOAuthData);
  const admin = new Admin();

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    contributorsCollection = db.collection("contributors");
    setCollectionForContributor(contributorsCollection);
    setCollection({ contributorsCollection });
    createdContributor = await contributor.create();
  });

  afterAll(async () => {
    db.collection("contributors").deleteMany({});
    await connection.close();
  });

  describe("should resolve by", () => {
    test("approving the contributor", async () => {
      const { _id } = createdContributor;
      const { isApproved } = await admin.handleContributorApproval({
        contributorId: _id,
      });
      expect(isApproved).toBe(true);
    });

    test("disapproving the contributor", async () => {
      const { _id } = createdContributor;
      const { isApproved } = await admin.handleContributorApproval({
        contributorId: _id,
        action: "disapprove",
      });
      expect(isApproved).toBe(false);
    });
  });

  describe("should reject for", () => {
    test("invalid ObjectID", async () => {
      try {
        await admin.handleContributorApproval({
          contributorId: "invalidObjectId",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid ObjectID is provided");
      }
    });

    test("invalid action", async () => {
      try {
        await admin.handleContributorApproval({
          contributorId: new ObjectID(),
          action: "invalidArgument",
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("Invalid action is provided");
      }
    });

    test("unmatched contributor", async () => {
      try {
        await admin.handleContributorApproval({
          contributorId: new ObjectID(),
        });
      } catch (rejectionMessage) {
        expect(rejectionMessage).toEqual("The contributor was not found");
      }
    });
  });
});
