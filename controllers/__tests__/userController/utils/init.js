jest.mock("../../../../models/User");
const reusable = require("../../../reusableFunctions");
jest.mock("../../../reusableFunctions", ()=>{
    return {
        sendFlashMessage: jest.fn(),
        respond: jest.fn()
    }
});

module.exports = reusable;