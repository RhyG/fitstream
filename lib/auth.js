const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  generateJWT: (user) => {
    const body = { id: user.id, email: user.email };
    return jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: "2d" });
  },
  generateTokenHash: async function (token) {
    const saltRounds = 10;
    return await bcrypt.hash(token, saltRounds);
  },
  validatePassword: async function (token, hashedToken) {
    return await bcrypt.compare(token, hashedToken);
  },
};
