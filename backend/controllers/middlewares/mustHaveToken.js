const {
  getTokenFromHeader,
  verifyToken,
  verifyRefreshToken,
  signToken,
} = require("@utils/jwtConfig");

async function renewAccessToken(refreshToken) {
  try {
    await verifyRefreshToken(refreshToken);
    const newAccessToken = signToken({
      payload: { message: "renewed access token" },
    });
    return newAccessToken;
  } catch (error) {
    if (error.message === "jwt expired") {
      console.log(
        "Caught on mustHaveToken middlewware, refresh token is expired"
      );
      return null;
    }
    return undefined;
  }
}

exports.mustHaveUserToken = async function mustHaveUserToken(req, res, next) {
  const token = getTokenFromHeader(req);
  try {
    const { payload } = await verifyToken({ token });
    req.payload = payload;
    return next();
  } catch (error) {
    let accessToken;
    if (error.message === "jwt expired") {
      accessToken = await renewAccessToken(req.query.refreshToken);
      return accessToken !== null
        ? res.status(401).json({ accessToken })
        : res.status(403).json(error.message);
    }
    return res.status(403).json(error.message);
  }
};

exports.mustHaveAdminToken = async function mustHaveAdminToken(req, res, next) {
  const token = getTokenFromHeader(req);
  try {
    const { payload } = await verifyToken({ token, admin: true });
    req.payload = payload;
    return next();
  } catch (error) {
    return res.status(403).json(error);
  }
};
