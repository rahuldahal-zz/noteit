const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const app = express();


let sessionOptions = session({
    secret: "NoteIT is awesome",
    store: new MongoStore({ client: require("./db") }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});

app.use(sessionOptions);
app.use(flash());



//middleware that the templates can use
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.errors = req.flash("errors");
    res.locals.successes = req.flash("success");
    next();
})

//routers
const rootRouter = require("./routers/rootRouter");
const usersRouter = require("./routers/usersRouter");
const notesRouter = require("./routers/notesRouter");
const contributorsRouter = require("./routers/contributorsRouter");
const adminRouter = require("./routers/adminRouter");

//ways to submit data to the server
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");


//using the routers
app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/contributors", contributorsRouter);
app.use("/admin", adminRouter);


//if router(s) do not handle the "route", this middleware will handle it
// app.use((req, res, next) => {
//     const error = new Error("The page you are looking for is not found");
//     error.status = 404;
//     next(error);
// })

// app.use((error, req, res, next) => {
//     res
//         .status(error.status || 500)
//         .render("404");
// })

module.exports = app;