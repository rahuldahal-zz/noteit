const { MongoClient } = require("mongodb");
const { Contributor, setCollection } = require("../../Contributors");
const dotenv = require("dotenv");
dotenv.config();

describe("createContributor", () => {
  let connection, db, contributorsCollection;

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    contributorsCollection = db.collection("contributors");
    setCollection(contributorsCollection);
  });

  afterAll(async () => {
    db.collection("contributors").deleteMany({});
    await connection.close();
  });

  const additionalDefaults = {
    _id: expect.any(require("mongodb").ObjectID),
    joinedOn: expect.any(Date),
    isApproved: false,
    recentContribution: null,
    contacts: {
      facebookProfileUrl: null,
      twitterProfileUrl: null,
      githubProfileUrl: null,
      websiteProfileUrl: null,
    },
  };

  test("should insert an contributor with facebook OAuth Data", async () => {
    const facebookOAuthData = {
      id: "123456FacebookID",
      email: "test@testing.com",

      first_name: "Rahul",
      last_name: "Dahal",
      picture: {
        data: {
          url: "https://pictureAPI.com",
        },
      },
    };

    const newContributor = await new Contributor(facebookOAuthData).create();

    expect(newContributor).toEqual({
      OAuthId: facebookOAuthData.id,
      email: facebookOAuthData.email,
      name: facebookOAuthData.name,
      picture: facebookOAuthData.picture.data.url,
      firstName: facebookOAuthData.first_name,
      lastName: facebookOAuthData.last_name,
      ...additionalDefaults,
    });
  });
});
