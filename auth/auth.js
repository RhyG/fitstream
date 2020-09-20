const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");

const JWTstrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { user: User } = require("../db/models");

passport.use(
  "register",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log(email);
        const user = await User.create({ email, password });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "login",
      passwordField: "password",
    },
    async (login, password, done) => {
      console.log("HERE");
      try {
        const user = await User.findByLogin(login);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        if (token.iat > new Date()) {
          return done(null, false);
        }

        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
