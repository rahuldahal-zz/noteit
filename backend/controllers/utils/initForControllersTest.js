jest.mock("../../models/User");
jest.mock("../../models/Notes");
const reusable = require("./respond");
jest.mock("./respond", () => {
  return {
    sendFlashMessage: jest.fn(),
  };
});

module.exports = reusable;
