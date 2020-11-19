const reusable = require("../utils/init");

const { viewParticularUnit } = require("../../notesController");

describe("Middleware: 'viewParticularUnit'", () => {
  // should call next
  test("should generate a valid view", async () => {
    const req = {
      requestedNote: {
        note: JSON.stringify,
      },
    };
    const res = {};
    const next = jest.fn();
    await viewParticularUnit(req, res, next);

    // assertions
  });

  // should respond error
  test("should ", async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    await viewParticularUnit(req, res, next);

    // assertions
  });
});
