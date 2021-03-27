const { checkSessionCount } = require("@controllers/userController");

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

  test("should respond status 400 with message", async () => {
    const req = {
      user: {
        sessionCount: 3,
      },
    };
    const next = jest.fn();
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    await checkSessionCount(req, res, next);

    // assertions
    expect(next).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Account is being used in more than 2 devices",
    });
  });
});
