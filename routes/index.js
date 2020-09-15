const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", passport.authenticate("register", { session: false }), register);
router.post("/login", login);

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res, next) => {
  // Send back user details and token
  res.json({
    message: "Secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

module.exports = router;
