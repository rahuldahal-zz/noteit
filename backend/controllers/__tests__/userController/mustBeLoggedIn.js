const reusable = require("../../utils/initForControllersTest");

const { mustBeLoggedIn } = require("@controllers/userController");

describe("Middleware: 'mustBeLoggedIn'", () => {
  test("should call next", async () => {
    const req = {
      user: {
        faculty: "bim",
        semester: "first",
      },
    };
    const res = {};
    const next = jest.fn();
    await mustBeLoggedIn(req, res, next);

    // assertions
    expect(next).toBeCalledTimes(1);
  });

  test("should send flash error", async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    await mustBeLoggedIn(req, res, next);

    // assertions
    expect(next).not.toBeCalled();
    expect(reusable.sendFlashMessage).toBeCalledTimes(1);
    expect(reusable.sendFlashMessage).toBeCalledWith({
      collection: "errors",
      message: "You must be logged in to perform that action",
      redirectURL: "/",
    });
  });
});
