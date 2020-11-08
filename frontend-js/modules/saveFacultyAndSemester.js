import axios from "axios";
import { saveAvailableNotes } from "./localStorageHandler";

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
            return location.replace("/home");
          }else{
            console.log("some error occurred while saving...");
          }
        })
        .catch((error) => console.log(error));
    });
  }
}
