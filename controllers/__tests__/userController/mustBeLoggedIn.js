jest.mock("../../../models/User");
const {mustBeLoggedIn} = require("../../userController");
const reusable = require("../../reusableFunctions");
jest.mock("../../reusableFunctions", ()=>{
    return {
        sendFlashMessage: jest.fn()
    }
});

test("Middleware: 'mustBeLoggedIn' should call next", async ()=>{
    const req = {
        user: {
            faculty: "bim",
            semester: "first"
        }
    };
    const next = jest.fn();
    await mustBeLoggedIn(req, {}, next);
    expect(next).toBeCalledTimes(1);
});

test("Middleware: 'mustBeLoggedIn' should send flash error", async ()=>{
    const req = {};
    const res = {};
    const next = jest.fn();
    await mustBeLoggedIn(req, res, next);
    expect(next).not.toBeCalled();
    expect(reusable.sendFlashMessage).toBeCalledTimes(1);
});