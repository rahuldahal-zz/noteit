const { MongoClient, ObjectID } = require("mongodb");
const {
  Contributor,
  setCollection: setCollectionForContributor,
} = require("@models/Contributors");
const { User, setCollection: setCollectionForUser } = require("@models/User");
const { Admin, setCollection } = require("@models/Admin");

describe("handleContributorApproval method", () => {
  let connection;
  let db;
  let contributorsCollection;
  let userCollection;
  let createdUser;

  const facebookOAuthData = {
    id: "123456FacebookID",
    email: "test@testing.com",
    firstName: "Rahul",
    lastName: "Dahal",
    picture: "https://pictureAPI.com",
  };
  const user = new User(facebookOAuthData, "facebook");
  const admin = new Admin();

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    contributorsCollection = db.collection("contributors");
    userCollection = db.collection("users");
    setCollectionForContributor(contributorsCollection);
    setCollectionForUser(userCollection);
    setCollection({ contributorsCollection, userCollection });
    createdUser = await user.create();
  });

  afterAll(async () => {
    await db.collection("contributors").deleteMany({});
    await db.collection("users").deleteMany({});
    await connection.close();
  });

  describe("should resolve by", () => {
    test("creating  contributor document", async () => {
      const { _id: userId } = createdUser;
      const additionalDefaults = {
        _id: expect.any(require("mongodb").ObjectID),
        joinedOn: expect.any(Date),
        recentContribution: null,
        contacts: {
          facebookProfileUrl: null,
          twitterProfileUrl: null,
          githubProfileUrl: null,
          websiteProfileUrl: null,
        },
      };
      const createdContributor = await new Contributor({
        userId: userId.toString(),
      }).create();
      expect(createdContributor).toEqual({
        userId: new ObjectID(userId),
        ...additionalDefaults,
      });
    });

    test("pushing  contributor role to corresponding user", async () => {
      const { _id: userId } = createdUser;
      const { _id } = await admin.findAndMakeContributor(userId);
      expect(_id).toEqual(userId);
    });
  });
});
