jest.mock("../../../models/User");
jest.mock("../../../models/Notes");
const reusable = require("../../utils/respond");
jest.mock("../../utils/respond", () => {
  return {
    sendFlashMessage: jest.fn(),
  };
});

module.exports = reusable;
