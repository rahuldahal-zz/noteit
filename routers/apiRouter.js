const router = require("express").Router();
const contributorsController = require("../controllers/contributorsController");

// restricting CORS to only specified domain

router.post("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST", "GET");
    return res.status(200).json({});
  }
});

router.post(
  "/contributors/create",
  contributorsController.isContributorAlreadyRegistered,
  contributorsController.create
);
router.get("/contributors", contributorsController.getAll);

module.exports = router;
