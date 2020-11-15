const supertest = require("supertest");
const URL = "http://localhost:3000";
const req = supertest(URL);

module.exports = req;