export function saveAvailableNotes(notes) {
  let subjects = notes.map((note) => note.subject);
  let subjectWiseUnits = {};
  subjects.forEach((subject) => {
    subjectWiseUnits[subject] = notes.filter((note) => note.subject == subject);
  });
  // console.log(subjectWiseUnits);
  localStorage.setItem("notes", JSON.stringify(subjectWiseUnits));
  return subjectWiseUnits;
}
