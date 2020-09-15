const passport = require("passport");
const jwt = require("jsonwebtoken");

const { user: User } = require("../db/models");

exports.register = async (req, res) => {
  const { username, email, password, firstName, lastName, isStreamer } = req.body;
  console.log("Creating user:", username);

  try {
    const newUser = await User.create({ username, email, password, firstName, lastName, isStreamer });
    return res.status(200).send(newUser);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (!user) {
        return next(new Error("User not found"));
      }

      if (err) {
        return next(new Error("An error occured"));
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { id: user.id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, "top_secret");
        //Send back the token to the user
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
