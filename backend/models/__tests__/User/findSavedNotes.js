const { MongoClient, ObjectID } = require("mongodb");
const { User, setCollection } = require("../../User");
const dotenv = require("dotenv");
dotenv.config();

describe("saveNote", () => {
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

  const googleOAuthData = {
    id: "123456GoogleID",
    email: "test@testing.com",

    firstName: "Rahul",
    lastName: "Dahal",
    picture: "https://pictureAPI.com",
  };

  const user = new User(googleOAuthData, "google");
  const mockNoteIDs = [new ObjectID(), new ObjectID()];

  test("should resolve by getting savedNotes", async () => {
    const { _id } = await user.createUser();
    const mockUser = new User({ _id });
    await mockUser.saveNotesHandler(mockNoteIDs[0]);
    await mockUser.saveNotesHandler(mockNoteIDs[1]);
    const savedNotes = await mockUser.findSavedNotes();
    expect(savedNotes).toEqual(expect.arrayContaining(mockNoteIDs));
  });

  test("should reject for unmatched ObjectID of user", async () => {
    try {
      await new User({ _id: new ObjectID() }).findSavedNotes();
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual("Cannot find the user");
    }
  });
});
