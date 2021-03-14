const express = require("express");
const router = express.Router();
const {
  root,
  google,
  facebook,
  callback,
  logout,
} = require("../controllers/authController");

router.get("/logout", logout);

router.get("/", root);

router.get("/google", google);

router.get("/facebook", facebook);

router.get("/google/redirect", google, callback);

router.get("/facebook/redirect", facebook, callback);

module.exports = router;
