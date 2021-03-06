const reusable = require("../../utils/initForControllersTest");
const { checkSessionCount } = require("../../userController");

describe("Middleware: 'checkSessionCount'", () => {
  test("should call next", async () => {
    const req = {
      user: {
        sessionCount: 2,
      },
    };
    const res = {};
    const next = jest.fn();
    await checkSessionCount(req, res, next);

    // assertions
    expect(next).toBeCalledTimes(1);
  });

  test("should send a flash error", async () => {
    const req = {
      user: {
        sessionCount: 3,
      },
    };
    const res = {};
    const next = jest.fn();
    await checkSessionCount(req, res, next);

    // assertions
    expect(next).not.toBeCalled();
    expect(reusable.sendFlashMessage).toBeCalledTimes(1);
    expect(reusable.sendFlashMessage).toBeCalledWith({
      collection: "errors",
      message: "Account is being used in more than 2 devices",
      redirectURL: "/",
    });
  });
});
