var express = require("express");
var router = express.Router();
const {
  getLocationFromIp,
  registerUser,
  loginUser,
  authenticateToken,
} = require("../controllers/api");

router.route("/ip/").get(authenticateToken, getLocationFromIp);
router.route("/ip/:ip").get(authenticateToken, getLocationFromIp);

router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);

module.exports = router;
