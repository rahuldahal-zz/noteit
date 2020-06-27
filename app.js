const express = require("express");
const passport = require("passport");
const passportController = require("./controllers/passportController");
const cookieSession = require("cookie-session");
const app = express();


let sessionOptions = {
    keys: ["NoteITisCreatedByRahulDahal"],
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
};

app.use(cookieSession(sessionOptions));

// initialize passport in our app, important
app.use(passport.initialize());
app.use(passport.session());



// this middle-ware sets the requested user object as a property to "locals" object, so that the templates can use
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

//routers
const rootRouter = require("./routers/rootRouter");
const authRouter = require("./routers/authRouter");
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
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/notes", notesRouter);
app.use("/contributors", contributorsRouter);
app.use("/admin", adminRouter);


// if router(s) do not handle the "route", this middle-ware will handle it
app.use((req, res, next) => {
    const error = new Error("The page you are looking for is not found");
    error.status = 404;
    next(error);
})

// this middle-ware sends the error to the client

app.use((error, req, res, next) => {
    switch (error.status) {
        case "401":
        case "403":
            res.status(error.status).send({ message: error.message });
        case "404":
            res.status(error.status).render("404");

    }
})

module.exports = app;