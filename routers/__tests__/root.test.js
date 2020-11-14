const supertest = require("supertest");
const URL = "http://localhost:3000";
const req = supertest(URL);

test("Endpoint: /", async (done)=>{
    const res = await req.get("/");
    console.log(res);
    const {status, body} = res;
    expect(status).toBe(200);
    ;
    done();
});