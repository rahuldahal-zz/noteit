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


    // save notes to local storage

    saveToLocalStorage(notes) {
        let subjects = notes.map((note) => note.subject);
        let subjectWiseUnits = {};
        subjects.forEach((subject) => {
            subjectWiseUnits[subject] = (notes.filter((note) => note.subject == subject));
        })
        localStorage.setItem("notes", JSON.stringify(subjectWiseUnits));
        setTimeout(() => window.location.href = "/home", 500);
    }

}