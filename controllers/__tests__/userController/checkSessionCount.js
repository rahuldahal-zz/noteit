const reusable = require("./utils/init");
const {checkSessionCount} = require("../../userController");

describe("Middleware: 'checkSessionCount'", ()=>{
    test("should call next", async ()=>{
        const req = {
            user: {
                sessionCount: 2
            }
        };
        const res = {};
        const next = jest.fn();
        await checkSessionCount(req, res, next);
        
        // assertions
        expect(next).toBeCalledTimes(1);
    });
    
    test("should respond 429", async ()=>{
        const req = {
            user: {
                sessionCount: 3
            }
        };
        const res = {};
        const next = jest.fn();
        await checkSessionCount(req, res, next);
        
        // assertions
        expect(next).not.toBeCalled();
        expect(reusable.respond).toBeCalledTimes(1);
        expect(reusable.respond).toBeCalledWith(429, "Account is being used in more than 2 devices", res);
    });
})