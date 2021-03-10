const express = require("express");
const app = express();
const path = require("path");

app.use(require("morgan")("combined"));
app.use(require("helmet")());
app.use(require("./utils/cspConfig"));

// ways to submit data to the server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routers
const rootRouter = require("./routers/rootRouter");
const usersRouter = require("./routers/usersRouter");
const notesRouter = require("./routers/notesRouter");
const contributorsRouter = require("./routers/contributorsRouter");
const adminRouter = require("./routers/adminRouter");

// server static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../build/index.html"));
  });
}

// using the routers
app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/contributors", contributorsRouter);
app.use("/admin", adminRouter);

module.exports = app;
