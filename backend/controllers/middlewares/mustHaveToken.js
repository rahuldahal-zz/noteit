const { getTokenFromHeader, verifyToken } = require("../../utils/jwtConfig");

module.exports = async function mustHaveToken(req, res, next) {
  const token = getTokenFromHeader(req);
  try {
    const { payload } = await verifyToken(token);
    req.payload = payload;
    next();
  } catch (error) {
    return res.status(403).json(error);
  }
};
