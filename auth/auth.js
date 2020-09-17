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
      try {
        //Find the user associated with the login provided by the user
        const user = await User.findByLogin(login);

        if (!user) {
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.validatePassword(password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        //Send the user information to the next middleware
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
      // Secret used to sign JWT
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        // Pass user details to next middleware
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
