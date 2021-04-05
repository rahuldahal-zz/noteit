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
    return error;
  }
}

exports.mustHaveUserToken = async function mustHaveUserToken(req, res, next) {
  const token = getTokenFromHeader(req);
  try {
    const { payload } = await verifyToken({ token });
    req.payload = payload;
    return next();
  } catch (error) {
    if (error.message === "jwt expired") {
      const accessToken = await renewAccessToken(req.query.refreshToken);
      return res.status(203).json({ accessToken });
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
