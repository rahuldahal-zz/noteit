import axios from "axios";

// save notes to local storage
export function saveToLocalStorage(notes) {
  console.log(notes);
  let subjects = notes.map((note) => note.subject);
  let subjectWiseUnits = {};
  subjects.forEach((subject) => {
    subjectWiseUnits[subject] = notes.filter((note) => note.subject == subject);
  });
  localStorage.setItem("notes", JSON.stringify(subjectWiseUnits));
  setTimeout(() => (window.location.href = "/home"), 500);
}

export default class SaveFacultyAndSemester {
  constructor() {
    this._csrf = document.querySelector('[name="_csrf"]').value;
    this.form = document.getElementById("saveFacultyAndSemester__form");
    this.faculty = document.getElementById("faculty");
    this.semester = document.getElementById("semester");
    this.events();
  }

  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      axios
        .post("/users/saveFacultyAndSemester", {
          faculty: this.faculty.value,
          semester: this.semester.value,
          _csrf: this._csrf,
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            return axios.post("/users/sendNotesToClient", {
              _csrf: this._csrf,
            });
          }
        })
        .then((notes) => saveToLocalStorage(notes.data))
        .catch((error) => console.log(error));
    });
  }
}
