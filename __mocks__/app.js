const express = require("express");
const app = express();
const db = require("./db");

// ways to submit data to the server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res)=>res.json({message: "This is a test"}));


module.exports = app;

