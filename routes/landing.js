const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const isLogin = req.query.isLogin;
  res.render("./pages/landing", { isLogin });
});

module.exports = router;
