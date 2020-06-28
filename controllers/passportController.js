const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");


passport.serializeUser((user, done) => {
    // user.id = ObjectId
    console.log("from serialize", user._id);
    done(null, user._id);
})

passport.deserializeUser((id, done) => {
    User.prototype.findByObjectId(id)
        .then((user) => {
            done(null, user)
        })
        .catch((error) => console.log(error));
})

passport.use(
    new GoogleStrategy({
        // options
        callbackURL: "/auth/google/redirect",
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
        (accessToken, refreshToken, profile, done) => {
            // passport callback

            // accessToken: token send by google, for accessing profile on behalf of the user, if needed

            // profile: passport will bring-back the user's profile info from google


            //check if user exists

            User.prototype.findByGoogleId(profile._json.sub)
                .then((currentUser) => {
                    console.log("The user already exists");
                    // done will call the serialize
                    return done(null, currentUser);


                })
                .catch((error) => createUser(profile._json, done));

        })
)


function createUser(profile, done) {
    let user = new User(profile, "google");
    user.createUser()
        .then((response) => {
            console.log(response);
            done(null, response);
        })
        .catch((error) => console.log(error));
}


// the "cookie-session" package helps to manage user's session on our website, if user is logged in or not
// cookie is encrypted with the "keys" defined in it's option
// when a user logs in, passport is gonna take the user's profile info. and looks in the db, grabs the "_id",
// adds the "_id" in the cookie and sends it to the browser
// when the cookie is received from the browser, passport deserializes the user and give us their profile via deserialize the user.

