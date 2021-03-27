const formFieldsDetail = [
  {
    type: "select",
    options: ["BIM", "BCA", "CSIT"],
    displayName: "Faculty",
    name: "faculty",
    defaultValue: null,
    placeholder: "your faculty",
  },
  {
    type: "select",
    options: [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
    ],
    displayName: "Semester",
    defaultValue: null,
    placeholder: "your semester",
  },
];

export default formFieldsDetail;
