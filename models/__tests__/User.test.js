const {checkFacultyAndSemester} = require("../User");

test("Check Faculty and Semester to be within an enum.", ()=>{
  expect(checkFacultyAndSemester("bim", "first")).toBe(true);
  expect(checkFacultyAndSemester("BcA", "ThirD")).toBe(true);
  expect(checkFacultyAndSemester("", "first")).toBe(false);
  expect(checkFacultyAndSemester("BCA", "")).toBe(false);
  expect(checkFacultyAndSemester("", "")).toBe(false);  
  expect(checkFacultyAndSemester("XYZ", "ninth")).toBe(false);  
});