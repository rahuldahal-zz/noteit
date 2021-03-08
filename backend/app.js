const express = require("express");
const passport = require("passport");
const passportController = require("./controllers/passportController"); // this needs to be here, in order to "run"
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const { initializeFlashHelper } = require("./controllers/utils/respond");
const adminRouter = require("./routers/adminRouter");
const csrf = require("csurf");
const helmet = require("helmet");
const contentSecurityPolicy = require("helmet-csp");
const app = express();

const currentTask = process.env.npm_lifecycle_event;

// // accept request from dev server
// if (currentTask === "dev") {
//   const cors = require("cors");
//   const corsOptions = require("./routers/utils/corsConfig");

//   app.use(cors(corsOptions));
// }

// while using helmet.js, webpack-dev-middleware does not seem to work("eval" thing error...). Therefore, using the following condition.
app.use(express.static("public"));
app.set("views", "views");
app.use(helmet());

app.use(
  contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        "https://ka-f.fontawesome.com",
        "https://fonts.gstatic.com",
        "https://lh3.googleusercontent.com",
        "https://platform-lookaside.fbsbx.com",
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://kit.fontawesome.com"],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://ka-f.fontawesome.com",
        "https://fonts.googleapis.com",
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);

// ways to submit data to the server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// the "API" router
app.use("/api", require("./routers/apiRouter"));

let sessionOptions = {
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
  store: new MongoStore({ client: require("./db")(true) }),
};

app.use(session(sessionOptions));

app.use(flash());
app.use(initializeFlashHelper);

// initialize passport in our app, important
app.use(passport.initialize());
app.use(passport.session());

// this middle-ware sets the requested user object as a property to "locals" object, so that the templates can use
app.use((req, res, next) => {
  console.log(req.flash("successes"));
  res.locals.user = req.user;
  res.locals.env = currentTask;
  res.locals.errors = req.flash("errors");
  res.locals.successes = req.flash("successes");
  return next();
});

// using the admin route

app.use("/admin", adminRouter);

//use the csurf, makes sure that every request that can change the state of app has a valid token
app.use(csrf());

// configuring csrf

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  return next();
});

//routers
const rootRouter = require("./routers/rootRouter");
const authRouter = require("./routers/authRouter");
const usersRouter = require("./routers/usersRouter");
const notesRouter = require("./routers/notesRouter");
const contributorsRouter = require("./routers/contributorsRouter");

//using the routers
app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/contributors", contributorsRouter);

// if router(s) do not handle the "route", this middle-ware will handle it
// app.use((err, req, res, next) => {
//   if (err && err.code === "EBADCSRFTOKEN") {
//     return res.status(400).send("Cross site request forgery detected");
//   }
//   res.render("404");
// });

module.exports = app;
