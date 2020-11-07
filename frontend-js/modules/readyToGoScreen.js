import axios from "axios";
import { saveAvailableNotes } from "./localStorageHandler";

export default class ReadyToGo {
  constructor() {
    console.log("I am running...readyToGo");
    this._csrf = document.querySelector('[name="_csrf"]').value;
    this.form = document.getElementById("readyToGoForm");
    this.events();
  }

  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      axios
        .get("/users/availableNotes")
        .then((notes) => {
          saveAvailableNotes(notes.data);
          location.replace("/home");
        })
        .catch((error) => {
          const errorObj = error.response;
          const {status, data} = errorObj;
          console.log(status, data);
        });
    });
  }
}
