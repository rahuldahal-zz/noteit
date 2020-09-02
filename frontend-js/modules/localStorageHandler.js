import axios from "axios";

export function saveToLocalStorage(notes) {
  let subjects = notes.map((note) => note.subject);
  let subjectWiseUnits = {};
  subjects.forEach((subject) => {
    subjectWiseUnits[subject] = notes.filter((note) => note.subject == subject);
  });
  console.log(subjectWiseUnits);
  localStorage.setItem("notes", JSON.stringify(subjectWiseUnits));
  return subjectWiseUnits;
}

export default class LocalStorageHandler {
  constructor() {
    console.log("The local storage runs");
    this.subjectsContainer = document.getElementById(
      "welcomeScreen__subjectsContainer"
    );
    this.savedNotes =
      document.getElementById("welcomeScreen__savedNotes") ||
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
        this.subjectWiseUnits = saveToLocalStorage(data);
        this.init();
      })
      .catch((error) => console.error(error));
  }

  init() {
    this.subjects = Object.keys(this.subjectWiseUnits);

    if (this.subjectsContainer) this.displaySubjects();
    if (this.savedNotes) this.initSavedNotes();

    this.events();
  }

  //display subjects on the "welcome screen"
  displaySubjects() {
    console.log(this.subjectWiseUnits);
    console.log(this.subjects);

    this.subjects.forEach((subject) => {
      let firstUnit = this.subjectWiseUnits[subject].find(
        (unit) => unit.unitNo == 1
      );
      this.subjectsContainer.insertAdjacentHTML(
        "beforeend",
        `
                 <a href="${firstUnit.url}" class="btn btn--brand">${subject}</a>
            `
      );
    });
  }

  initSavedNotes() {
    //savedNoteContainers will contain those "input" with class "savedNoteId" fields via the welcome/notes.ejs
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
  }
}
