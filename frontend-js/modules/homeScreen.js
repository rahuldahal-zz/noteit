import axios from "axios";
import { saveAvailableNotes } from "./localStorageHandler";

export default class HomeScreen {
  constructor() {
    this.subjectsContainer = document.getElementById(
      "homeScreen__subjectsContainer"
    );
    this.savedNotes =
      document.getElementById("homeScreen__savedNotes") ||
      document.getElementById("notesScreen__savedUnits");

    this.subjectWiseUnits = JSON.parse(localStorage.getItem("notes"));
    this.logoutForm = document.getElementById("logoutForm");

    if (!this.subjectWiseUnits) {
      this.getAvailableNotes();
    } else {
      this.init();
    }
  }

  //events

  events() {
    this.logoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.removeNotes();
    });
  }

  //methods

  getAvailableNotes() {
    axios
      .get("/users/availableNotes")
      .then(({ data }) => {
        this.subjectWiseUnits = saveAvailableNotes(data);
        this.init();
      })
      .catch((error) => console.log("You are not approved yet!!"));
  }

  init() {
    this.subjects = Object.keys(this.subjectWiseUnits);

    if (this.subjectsContainer) this.createSubjectsButton();
    if (this.savedNotes) this.initSavedNotes();

    this.events();
  }

  //display subjects on the "home screen"
  createSubjectsButton() {
    console.log(this.subjectWiseUnits);
    this.subjects.forEach((subject) => {
      this.subjectsContainer.insertAdjacentHTML(
        "beforeend",
        `
                 <button class="btn btn--brand" data-subject="${subject}">${subject}</button>
            `
      );
    });

    const subjectBtns = document.querySelectorAll("[data-subject]");
    subjectBtns.forEach((subject) => {
      subject.addEventListener("click", (e) => this.displayAvailableUnits(e));
    });
  }

  displayAvailableUnits(e) {
    const units = this.subjectWiseUnits[e.currentTarget.dataset.subject];
    document.body.classList.add("overlay--active");
    this.subjectsContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div id="availableUnits">
      ${units.map((unit) => {
        return `<a href="${unit.url}" class="btn">${unit.title}</a>`;
      })}
      </div>
    `
    );
  }

  initSavedNotes() {
    //savedNoteContainers will contain those "input" with class "savedNoteId" fields via the home/notes.ejs
    const savedNoteContainers = document.querySelectorAll(".savedNoteId");

    savedNoteContainers.forEach((savedNote) => {
      let savedNote_id = savedNote.value; //the "value" of "input" is the "noteId"

      //filter the "saved units" from overall available units
      this.subjects.map((subject) => {
        let savedNoteDetail = this.subjectWiseUnits[subject].find(
          (unit) => unit._id == savedNote_id
        );
        if (savedNoteDetail) {
          savedNote.subject = savedNoteDetail.subject;
          savedNote.url = savedNoteDetail.url;
          savedNote.title = savedNoteDetail.title;
        }
      });
    });

    this.sortAndDisplaySavedNotes(savedNoteContainers);
  }

  sortAndDisplaySavedNotes(savedNotes) {
    let savedSubjects = {};
    Array.from(savedNotes).map((note) => {
      savedSubjects[note.subject] = 1;
    });
    let savedSubjectsArray = Object.keys(savedSubjects);
    let savedNoteContainers = [];
    savedSubjectsArray.forEach((subject) => {
      let savedNoteContainer = document.createElement("div");
      savedNoteContainer.setAttribute("class", "savedNoteContainer");
      savedNoteContainer.insertAdjacentHTML("beforeend", `<h5>${subject}</h5>`);
      savedNoteContainer.dataset.subject = subject;
      savedNoteContainers.push(savedNoteContainer);
      this.savedNotes.appendChild(savedNoteContainer);
    });
    savedNotes.forEach((savedNote) => {
      let associatedSubjectContainer = savedNoteContainers.find(
        (container) => container.dataset.subject === savedNote.subject
      );
      associatedSubjectContainer.insertAdjacentHTML(
        "beforeend",
        `
                  <div class="savedNote">
                      <a href="${savedNote.url}">${savedNote.title}</a>
                  </div>
              `
      );
    });
  }

  //remove "notes" from localStorage
  removeNotes() {
    localStorage.removeItem("notes");
    this.logoutForm.submit();
    location.reload();
  }
}
