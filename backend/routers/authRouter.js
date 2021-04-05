const router = require("express").Router();
const {
  root,
  google,
  facebook,
  callback,
  logout,
} = require("@controllers/authController");
const { mustHaveUserToken } = require("@controllers/middlewares/mustHaveToken");

router.get("/refreshToken", mustHaveUserToken, (req, res) => res.status(202));

router.get("/logout", logout);

router.get("/", root);

router.get("/google", google);

router.get("/facebook", facebook);

router.get("/google/redirect", google, callback);

router.get("/facebook/redirect", facebook, callback);

module.exports = router;
