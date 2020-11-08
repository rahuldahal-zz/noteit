import axios from "axios";

export default class CreateNote {
  constructor(jwt) {
    this.jwt = jwt;
    this.form = document.getElementById("createNoteForm");
    this.unitNo = document.querySelector('[name="unitNo"]');
    this.title = document.querySelector('[name="title"]');
    this.subject = document.querySelector('[name="subject"]');
    this.faculty = document.querySelector('[name="faculty"]');
    this.semester = document.querySelector('[name="semester"]');
    this.note = document.querySelector('[name="note"]');
    this.contributors = document.querySelector('[name="contributor"]');
    this.loadContributors();
    this.events();
  }

  //events
  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendNotesToServer();
    });
  }

  //methods
  loadContributors() {
    axios
      .post("/api/admin/contributors", { token: this.jwt })
      .then((response) => this.injectContributors(response.data));
  }

  injectContributors(contributors) {
    console.log(contributors);
    this.contributors.insertAdjacentHTML(
      "beforeend",
      `
            ${contributors
              .map((contributor) => {
                return `
                        <option value="${contributor._id}">${contributor.name}</option>
                    `;
              })
              .join("")}
        `
    );
  }

  sendNotesToServer() {
    axios
      .post("/api/admin/notes/create", {
        unitNo: this.unitNo.value,
        title: this.title.value,
        subject: this.subject.value,
        faculty: this.faculty.value,
        semester: this.semester.value,
        contributor: this.contributors.value,
        note: this.note.value,
        token: this.jwt,
      })
      .then((response) => {
        console.log(response.status);
        document.forms[0].reset();
      });
  }
}
