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
  const particularNoteID = new ObjectID();

  test("should resolve by saving and removing a particular note", async () => {
    const { _id } = await user.createUser();
    const savedDoc = await new User({ _id }).saveNotesHandler(particularNoteID);
    const removedDoc = await new User({ _id }).saveNotesHandler(
      particularNoteID,
      "remove"
    );
    expect(savedDoc.savedNotes).toEqual(
      expect.arrayContaining([particularNoteID])
    );
    expect(removedDoc.savedNotes).not.toEqual(
      expect.arrayContaining([particularNoteID])
    );
  });

  test("should reject for invalid ObjectID of a particular note", async () => {
    try {
      await new User().saveNotesHandler("invalidObjectID");
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual(
        "Invalid ObjectID is provided for that note."
      );
    }
  });

  test("should reject for invalid action", async () => {
    try {
      await new User().saveNotesHandler(particularNoteID, "invalidAction");
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual(
        "Invalid action is provided. Only save and remove are accepted."
      );
    }
  });

  test("should reject for unmatched ObjectID of user", async () => {
    try {
      await new User({ _id: new ObjectID() }).saveNotesHandler(
        particularNoteID
      );
    } catch (rejectionMessage) {
      expect(rejectionMessage).toEqual("Cannot find the user");
    }
  });
});
