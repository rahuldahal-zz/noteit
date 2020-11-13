const express = require("express");
const passport = require("passport");
const passportController = require("./controllers/passportController"); // this need to be here, in order to "run"
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const adminRouter = require("./routers/adminRouter");
const csrf = require("csurf");
const helmet = require("helmet");
const app = express();

const currentTask = process.env.npm_lifecycle_event;

// while using helmet.js, webpack-dev-middleware does not seem to work("eval" thing error...). Therefore, using the following condition.

app.use(function(req, res, next) {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://kit.fontawesome.com");
  return next();
});

app.use(express.static('public'));
app.set("views", "views");
app.set("view engine", "ejs");

if (currentTask === "dev") {
  // webpack-dev-middleware setup(bundle in memory)
  const webpack = require("webpack");
  const webpackConfigFile = require("./webpack.config");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const compiler = webpack(webpackConfigFile);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfigFile.output.publicPath,
      writeToDisk: (filePath) => {
        return /\.ejs$/.test(filePath);
      },
    })
  );
} else {
  app.use(helmet());
}

// ways to submit data to the server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// the "API" router
app.use("/api", require("./routers/apiRouter"));

let sessionOptions = {
  secret: process.env.sessionSecret,
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 240, httpOnly: true }, // change this to 24 in production
};

app.use(session(sessionOptions));

app.use(flash());

// initialize passport in our app, important
app.use(passport.initialize());
app.use(passport.session());

// using the admin route

app.use((req, res, next)=>{
  res.renderTemplate = function(template, data = null){
    console.log(`renders ${template}`);
    return res.render("index", {toRender: template, data});
  }
  return next();
})

app.use("/admin", adminRouter);

// this middle-ware sets the requested user object as a property to "locals" object, so that the templates can use
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.env = currentTask;
  res.locals.errors = req.flash("errors");
  res.locals.successes = req.flash("successes");
  return next();
});


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
