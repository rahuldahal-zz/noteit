const { root } = require("@controllers/authController");
const { signRefreshToken } = require("@utils/jwtConfig");

describe("Controller: 'authenticate>index'", () => {
  const responsePrototype = {
    isAuthenticated: false,
    isNewUser: false,
    accessToken: null,
    refreshToken: null,
  };

  test("should respond with 401 when not authenticated", async () => {
    const req = {};
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    await root(req, res);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith(responsePrototype);
  });

  test("should respond with 200 status and tokens in body", async () => {
    const req = {
      user: {
        refreshToken: signRefreshToken({ id: 123 }),
        roles: ["basic"],
      },
    };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    await root(req, res);
    expect(res.status).toBeCalledWith(200);
    responsePrototype.isAuthenticated = true;
    responsePrototype.isAdmin = false;
    responsePrototype.isNewUser = true;
    responsePrototype.refreshToken = req.user.refreshToken;

    delete responsePrototype.accessToken;

    expect(res.json).toBeCalledWith(expect.objectContaining(responsePrototype));
  });
});
