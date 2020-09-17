const jwt = require("jsonwebtoken");

module.exports = {
  generateJWT: (user) => {
    const body = { id: user.id, email: user.email };
    return jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: "48h" });
  },
};
