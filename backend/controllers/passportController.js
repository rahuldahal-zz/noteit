const { User } = require("@models/User");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const dotenv = require("dotenv");

dotenv.config();

passport.serializeUser((user, done) => {
  console.log("from serialize, user id is ", user._id);
  User.prototype
    .sessionCountHandler(user._id, "increment")
    .then(() => done(null, user._id))
    .catch((err) => console.log("from serialize: " + err));
});

passport.deserializeUser((id, done) => {
  console.log("deserialize fires...");
  User.prototype
    .findBy({
      criteria: "ObjectId",
      value: id,
      update: "lastLogin",
    })
    .then((user) => {
      done(null, user);
    })
    .catch((error) => done(error));
});

passport.use(
  new GoogleStrategy(
    {
      // options
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback

      // accessToken: token send by google, for accessing profile on behalf of the user, if needed

      // profile: passport will bring-back the user's profile info from google

      //check if user exists

      User.prototype
        .findBy({
          criteria: "OAuthId",
          value: profile._json.sub,
        })
        .then((currentUser) => {
          console.log("The user already exists");
          // done will call the serialize
          return done(null, currentUser);
        })
        .catch((error) => createUser(profile._json, done, "google"));
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: [
        "id",
        "displayName",
        "first_name",
        "last_name",
        "photos",
        "email",
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists

      User.prototype
        .findBy({
          criteria: "OAuthId",
          value: profile._json.id,
        })
        .then((currentUser) => {
          console.log("The user already exists");

          // done will call the serialize
          return done(null, currentUser);
        })
        .catch((error) => createUser(profile._json, done, "facebook"));
    }
  )
);

function createUser(profile, done, provider) {
  console.log("creating a new user...");
  if (provider === "google") {
    const { sub, given_name, family_name, email, picture } = profile;
    profile = {
      id: sub,
      firstName: given_name,
      lastName: family_name,
      email: email,
      picture: picture,
    };
  } else {
    const { id, first_name, last_name, email, picture } = profile;
    profile = {
      id,
      firstName: first_name,
      lastName: last_name,
      email: email ? email : "",
      picture: picture.data.url,
    };
  }
  const user = new User(profile, provider);
  user
    .createUser()
    .then((response) => {
      done(null, response);
    })
    .catch((error) => console.log(error));
}

// the "cookie-session" package helps to manage user's session on our website, if user is logged in or not
// cookie is encrypted with the "keys" defined in it's option
// when a user logs in, passport is gonna take the user's profile info. and looks in the db, grabs the "_id",
// adds the "_id" in the cookie and sends it to the browser
// when the cookie is received from the browser, passport deserializes the user and give us their profile via deserialize the user.
