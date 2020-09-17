const passport = require("passport");
const jwt = require("jsonwebtoken");

const { generateJWT } = require("../lib/auth");
const { user: User } = require("../db/models");

exports.register = async (req, res) => {
  const { username, email, password, firstName, lastName, isStreamer } = req.body;
  console.log("Creating user:", email);

  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  try {
    const newUser = await User.create({ username, email, password, firstName, lastName, isStreamer });

    const { id, username, email } = newUser;

    return res.status(200).send({ id, username, email });
  } catch (err) {
    return res.send(err);
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal server error." });
      }

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = generateJWT(user);
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.refreshToken = async (req, res) => {};
