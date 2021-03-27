const { authRole } = require("@controllers/userController");

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
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const middleware = authRole(ROLE_TO_BE_CHECKED);
    await middleware(req, res, next);

    // assertions
    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      message: "This route is restricted to admin(s) only",
    });
  });
});
