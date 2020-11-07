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
            return axios.get("/users/availableNotes");
          }
        })
        .then((response) => {
          saveAvailableNotes(response.data);
          switch(response.status){
            case 200:
              return setTimeout(() => (window.replace("/home")), 500);
            case 403:
              return console.error(response.status);
          }
        })
        .catch((error) => console.log(error));
    });
  }
}
