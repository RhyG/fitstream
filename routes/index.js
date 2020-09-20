const express = require("express");

const { register, login, refreshToken } = require("../controllers/authController");
const { subscribeToChannel } = require("../controllers/subscribe");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/refresh", refreshToken);

router.get("/profile", authenticateJWT, (req, res, next) => {
  // Send back user details and token
  res.json({
    message: "Secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

router.post("/subscribe/:id", authenticateJWT, subscribeToChannel);

module.exports = router;
