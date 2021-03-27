const express = require("express");
const app = express();
const passport = require("passport");
require("./controllers/passportController"); // this needs to be here, in order to "run"
const cookieSession = require("cookie-session");
const path = require("path");

app.use(require("morgan")("combined"));
app.use(require("helmet")());
app.use(require("./utils/cspConfig"));
app.use(
  cookieSession({
    name: "userSession",
    maxAge: 24 * 60 * 60 * 100,
    keys: [process.env.SESSION_SECRET],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ways to submit data to the server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routers
const rootRouter = require("./routers/rootRouter");
const authRouter = require("./routers/authRouter");
const usersRouter = require("./routers/usersRouter");
const notesRouter = require("./routers/notesRouter");
const contributorsRouter = require("./routers/contributorsRouter");
const adminRouter = require("./routers/adminRouter");

// using the routers
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/contributors", contributorsRouter);
app.use("/admin", adminRouter);

// server static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build/index.html"));
  });
} else {
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));
}

module.exports = app;
