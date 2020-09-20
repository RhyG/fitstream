const passport = require("passport");
const randtoken = require("rand-token");

const { generateJWT, generateTokenHash } = require("../lib/auth");
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

    res.status(200).send({ id, username, email });
  } catch (err) {
    res.send(err);
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
        const refreshToken = randtoken.uid(256);

        await User.update(
          {
            refreshToken: generateTokenHash(refreshToken),
          },
          {
            where: {
              id: user.id,
            },
          }
        );

        res.json({ token, refreshToken });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        refreshToken: req.body.refreshToken,
      },
    });

    if (!user) {
      return res.status(401).json({ status: "fail", message: "Refresh token invalid or expired." });
    }

    req.login(user, { session: false }, async (error) => {
      if (error) return res.send(error);

      const token = generateJWT(user);

      res.json({ token });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "Fail", message: "Internal server error" });
  }
};

exports.disableToken = async (req, res) => {
  try {
    const user = User.findOne({
      where: {
        refreshToken: req.body.refreshToken,
      },
    });

    if (!user) {
      return res.status(401).json({ status: "fail", message: "Refresk token invalid or expired." });
    }

    await user.update({ refreshToken: null });
    res.send(204);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: "Fail", message: "Internal server error" });
  }
};
