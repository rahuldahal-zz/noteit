const { MongoClient } = require("mongodb");
const { User, setCollection } = require("../../User");
const dotenv = require("dotenv");
dotenv.config();

describe("createUser", () => {
  let connection, db, usersCollection;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.TEST_CONNECTIONSTRING, {
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

  test("should insert an user with google OAuth Data", async () => {
    const googleOAuthData = {
      sub: "123456GoogleID",
      email: "test@testing.com",
      name: "Rahul Dahal",
      given_name: "Rahul",
      family_name: "Dahal",
      picture: "https://pictureAPI.com",
    };

    const newUser = await new User(googleOAuthData, "google").createUser();

    expect(newUser).toEqual({
      OAuthId: googleOAuthData.sub,
      email: googleOAuthData.email,
      name: googleOAuthData.name,
      picture: googleOAuthData.picture,
      firstName: googleOAuthData.given_name,
      lastName: googleOAuthData.family_name,
      ...additionalDefaults,
    });
  });

  test("should insert an user with facebook OAuth Data", async () => {
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

    const newUser = await new User(facebookOAuthData, "facebook").createUser();

    expect(newUser).toEqual({
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
