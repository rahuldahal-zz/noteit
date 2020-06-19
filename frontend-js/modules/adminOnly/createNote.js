import axios from "axios";

export default class CreateNote {
    constructor() {
        this.form = document.querySelector('[action="/notes/createNote"]');
        this.unitNo = document.querySelector('[name="unitNo"]');
        this.title = document.querySelector('[name="title"]');
        this.subject = document.querySelector('[name="subject"]');
        this.faculty = document.querySelector('[name="faculty"]');
        this.semester = document.querySelector('[name="semester"]');
        this.contributors = document.querySelector('[name="contributor"]');
        this.loadContributors();
        this.events();
    }

    //events
    events() {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.sendNotesToServer();
        })
    }

    //methods
    loadContributors() {
        axios.get("/admin/getContributors")
            .then((response) => this.injectContributors(response.data));
    }

    injectContributors(contributors) {
        this.contributors.insertAdjacentHTML("beforeend", `
            ${
            contributors.map((contributor) => {
                return `
                        <option value="${contributor._id}">${contributor.username}</option>
                    `
            })
            }
        `)
    }

    sendNotesToServer() {
        axios.post("/notes/createNote", {
            unitNo: this.unitNo.value,
            title: this.title.value,
            subject: this.subject.value,
            faculty: this.faculty.value,
            semester: this.semester.value,
            contributor: this.contributors.value
        })
            .then((response) => {
                console.log(response.status);
                document.forms[0].reset();
            });
    }
}