const reusable = require("../utils/init");

const { checkForCorrectSubscription } = require("../../notesController");

describe("Middleware: 'checkForCorrectSubscription'", () => {
  // should call next
  test("should call next", async () => {
    const req = {
      user: {
        faculty: "bim",
        semester: "third",
      },
      params: {
        faculty: "bim",
        semester: "third",
      },
    };
    const res = {};
    const next = jest.fn();
    await checkForCorrectSubscription(req, res, next);

    // assertions
    expect(next).toBeCalledTimes(1);
  });

  // should respond error
  test("should send flash message", async () => {
    const req = {
      user: {
        faculty: "bim",
        semester: "first",
      },
      params: {
        faculty: "bim",
        semester: "third",
      },
    };
    const res = {};
    const next = jest.fn();
    await checkForCorrectSubscription(req, res, next);

    // assertions
    expect(next).not.toBeCalled();
    expect(reusable.sendFlashMessage).toBeCalledTimes(1);
    expect(reusable.sendFlashMessage).toBeCalledWith({
      collection: "errors",
      message: "You do not have correct subscription to access this resource.",
      redirectURL: "/home",
    });
  });
});
