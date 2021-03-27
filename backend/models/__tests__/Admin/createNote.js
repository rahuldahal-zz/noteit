const { MongoClient, ObjectID } = require("mongodb");
const {
  Contributor,
  setCollection: setCollectionForContributor,
} = require("@models/Contributors");
const {
  Notes,
  setCollection: setCollectionForNotes,
} = require("@models/Notes");
const { Admin, setCollection } = require("@models/Admin");

describe("handleContributorApproval method", () => {
  let connection;
  let db;
  let contributorsCollection;
  let notesCollection;

  const note = {
    unit: "1",
    title: "Some Title",
    faculty: "BIM",
    semester: "first",
    subject: "Principles Of Management",
    note: "# My markdown\n> Quoted from xyz",
    contributor: "605c837ed1647e4bc1cdf108",
  };
  const admin = new Admin();

  beforeAll(async () => {
    connection = await MongoClient.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    contributorsCollection = db.collection("contributors");
    notesCollection = db.collection("notes");
    setCollectionForContributor(contributorsCollection);
    setCollectionForNotes(notesCollection);
    setCollection({ contributorsCollection, notesCollection });
  });

  afterAll(async () => {
    await db.collection("notes").deleteMany({});
    await connection.close();
  });

  describe("should resolve by", () => {
    test("creating  contributor document", async () => {
      const additionalDefaults = {
        _id: expect.any(require("mongodb").ObjectID),
        url: `/notes/${note.faculty}/${note.semester}/${encodeURIComponent(
          note.subject
        )}/${encodeURIComponent(note.title)}`,
        createdDate: expect.any(Number),
      };
      const createdNote = await admin.createNote(note);
      const { unit, contributor, faculty, semester, ...rest } = note;
      expect(createdNote).toEqual({
        unit: parseInt(unit, 10),
        faculty: faculty.toLowerCase(),
        semester: semester.toLowerCase(),
        contributor: new ObjectID(contributor),
        ...rest,
        ...additionalDefaults,
      });
    });
  });
});
