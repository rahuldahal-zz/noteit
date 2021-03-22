const express = require("express");
const router = express.Router();
const { login } = require("../controllers/adminController");
const { authRole } = require("../controllers/userController");
const {
  mustHaveUserToken,
} = require("../controllers/middlewares/mustHaveToken");

router.post("/login", mustHaveUserToken, authRole("admin"), login);

module.exports = router;
