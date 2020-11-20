const User = require("../../User");

test("User Model", () => {
  const name = new User().nameIs();
  expect(name).toEqual("Rahul");
});
