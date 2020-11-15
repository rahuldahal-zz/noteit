const app = require("../../app");
const supertest = require("supertest");
const req = supertest(app);

jest.mock("../../db");
jest.mock("../../app");

test("Endpoint: /", async (done)=>{
    const res = await req.get("/");
    const {status, body} = res;
    expect(status).toBe(200);
    expect(body.message).toBe("This is a test");
    done();
});