import axios from "axios";

export default class SaveFacultyAndSemester {
    constructor() {
        console.log("I run");
        this.form = document.getElementById("saveFacultyAndSemester__form");
        this.faculty = document.getElementById("faculty");
        this.semester = document.getElementById("semester");
        this.events();
    }

    events() {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            axios.post("/users/saveFacultyAndSemester", { faculty: this.faculty.value, semester: this.semester.value })
                .then((response) => {
                    if (response.status === 200) {
                        return axios.post("/users/sendNotesToClient")
                    }
                })
                .then((notes) => this.saveToLocalStorage(notes.data))
                .catch((error) => console.log(error));
        })
    }

    saveToLocalStorage(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
        setTimeout(() => window.location.href = "/home", 500);
    }
}