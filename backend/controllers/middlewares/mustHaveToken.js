const { getTokenFromHeader, verifyToken } = require("@utils/jwtConfig");

exports.mustHaveUserToken = async function mustHaveUserToken(req, res, next) {
  const token = getTokenFromHeader(req);
  try {
    const { payload } = await verifyToken({ token });
    req.payload = payload;
    return next();
  } catch (error) {
    return res.status(403).json(error);
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
