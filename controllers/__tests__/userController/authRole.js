const reusable = require("../utils/init");
const { authRole } = require("../../userController");

describe("Middleware: 'authRole'", () => {
  const ROLE_TO_BE_CHECKED = "admin";

  // should call next
  test("should call next", async () => {
    const req = {
      user: {
        roles: ["basic", ROLE_TO_BE_CHECKED],
      },
    };
    const res = {};
    const next = jest.fn();
    const middleware = authRole(ROLE_TO_BE_CHECKED);
    await middleware(req, res, next);

    // assertions
    expect(next).toBeCalledTimes(1);
  });

  // should respond error
  test("should respond error", async () => {
    const req = {
      user: {
        roles: ["basic"],
      },
    };
    const res = {};
    const next = jest.fn();
    const middleware = authRole(ROLE_TO_BE_CHECKED);
    await middleware(req, res, next);

    // assertions
    expect(next).not.toBeCalled();
    expect(reusable.sendFlashMessage).toBeCalledWith({
      collection: "errors",
      message: "You do not have the permission to access this page.",
      redirectURL: "/",
    });
  });
});
