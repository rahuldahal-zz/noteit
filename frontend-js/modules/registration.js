import axios from "axios";

//exports "sendRequest" separately, is used in "login.js"

export function sendRequest(route, body) {
    axios.post(route, body)
        .then((response) => {
            if (typeof (response.data) === "object")
                setNotes(response.data);
            else if (typeof (response.data) === "string") {
                console.log(response.data);
                let flashWrap = document.getElementById("flash-wrap");
                flashWrap.innerHTML = `<p class="flashError">${response.data}</p>`;
                flashWrap.classList.add("visible");
                flashWrap.addEventListener("click", function () { flashWrap.classList.remove("visible") });
            }
        })
        .catch((error) => console.log(error));


    //set "notes" to local storage
    function setNotes(notes) {
        let subjects = notes.map((note) => note.subject);
        let subjectWiseUnits = {};
        subjects.forEach((subject) => {
            subjectWiseUnits[subject] = (notes.filter((note) => note.subject == subject));
        })
        localStorage.setItem("notes", JSON.stringify(subjectWiseUnits));
        setTimeout(() => {
            window.location.href = "/home";
        }, 700);
    }
}




export default class RegistrationForm {
    constructor() {
        this.form = document.getElementById("registrationForm");
        this.username = document.querySelector("#registrationUsername");
        this.email = document.querySelector("#registrationEmail");
        this.password = document.querySelector("#registrationPassword");
        this.faculty = document.querySelector("#registrationFaculty");
        this.semester = document.querySelector("#registrationSemester");
        this.username.previousValue = "";
        this.email.previousValue = "";
        this.password.previousValue = "";
        this.username.isUnique = false;
        this.email.isUnique = false;
        this.clearValidationMessage();
        this.events();
    }

    //events
    events() {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.formSubmitHandler();
        })
        this.username.addEventListener("keyup", () => {
            this.isDifferent(this.username, this.usernameHandler);
        })
        this.email.addEventListener("keyup", () => {
            this.isDifferent(this.email, this.emailHandler);
        })
        this.password.addEventListener("keyup", () => {
            this.isDifferent(this.password, this.passwordHandler);
        })
        this.faculty.addEventListener("change", () => {
            this.faculty.errors = false;
            this.facultyHandler();
        });
        this.semester.addEventListener("change", () => {
            this.semester.errors = false;
            this.semesterHandler();
        });


        //check on blur as well
        this.username.addEventListener("blur", () => {
            this.isDifferent(this.username, this.usernameHandler);
        })
        this.email.addEventListener("blur", () => {
            this.isDifferent(this.email, this.emailHandler);
        })
        this.password.addEventListener("blur", () => {
            this.isDifferent(this.password, this.passwordHandler);
        })
    }

    //methods
    clearValidationMessage() {
        let messages = document.querySelectorAll(".validationMessage");
        messages.forEach((msg) => msg.textContent = "");
    }

    formSubmitHandler() {
        this.usernameImmediately();
        this.passwordImmediately();
        this.usernameAfterDelay();
        this.emailAfterDelay();
        this.passwordAfterDelay();
        this.facultyHandler();
        this.semesterHandler();

        if (
            this.username.isUnique &&
            !this.username.errors &&
            this.email.isUnique &&
            !this.email.errors &&
            !this.password.errors &&
            !this.faculty.errors &&
            !this.semester.errors
        ) {
            sendRequest("/users/register", {
                username: this.username.value,
                email: this.email.value,
                password: this.password.value,
                faculty: this.faculty.value,
                semester: this.semester.value
            });
        }
    }

    isDifferent(el, handler) {
        if (el.previousValue != el.value)
            handler.call(this);
        el.previousValue = el.value;
    }

    usernameHandler() {
        this.username.errors = false;
        clearTimeout(this.username.timer);
        this.usernameImmediately();
        this.username.timer = setTimeout(() => this.usernameAfterDelay(), 1000);
    }
    emailHandler() {
        this.email.errors = false;
        clearTimeout(this.email.timer);
        this.email.timer = setTimeout(() => this.emailAfterDelay(), 1000);
    }
    passwordHandler() {
        this.password.errors = false;
        clearTimeout(this.password.timer);
        this.passwordImmediately();
        this.password.timer = setTimeout(() => this.passwordAfterDelay(), 1000);
    }

    facultyHandler() {
        let facultyValue = this.faculty.value;
        if (!facultyValue)
            this.showError(this.faculty, "You must choose your faculty");
        if (!(facultyValue == "BIM" || facultyValue == "BCA" || facultyValue == "CSIT"))
            this.showError(this.faculty, "Please choose a valid faculty");
        if (!this.faculty.errors)
            this.hideError(this.faculty);
    }

    semesterHandler() {
        let semesterValue = this.semester.value;
        if (!semesterValue)
            this.showError(this.semester, "You must choose your semester");
        if (!(
            semesterValue == "first" ||
            semesterValue == "second" ||
            semesterValue == "third" ||
            semesterValue == "fourth" ||
            semesterValue == "fifth" ||
            semesterValue == "sixth" ||
            semesterValue == "seventh" ||
            semesterValue == "eighth"
        ))
            this.showError(this.semester, "Please choose a valid semester");
        if (!this.semester.errors)
            this.hideError(this.semester);
    }

    usernameImmediately() {
        let usernameValue = this.username.value;
        if (usernameValue.length > 30)
            this.showError(this.username, "username must not exceed 30 characters");
        if (usernameValue != "" && !/^([a-zA-Z0-9]+)$/.test(usernameValue))
            this.showError(this.username, "username can contain only letters and numbers");
        if (!this.username.errors)
            this.hideError(this.username);
    }

    usernameAfterDelay() {
        let usernameValue = this.username.value;
        if (usernameValue.length < 3)
            this.showError(this.username, "username must be at least 3 characters long");

        //talk to the db and check if username is unique
        if (!this.username.errors) {
            axios.post("/users/doesUsernameExist", { username: this.username.value })
                .then((response) => {
                    if (response.data) {
                        this.showError(this.username, "this username already exists, try a different one!");
                        this.username.isUnique = false;
                    }
                    else {
                        this.username.isUnique = true;
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    emailAfterDelay() {
        if (!/^\S+@\S+$/.test(this.email.value)) {
            this.showError(this.email, "You must provide a valid email address");
        }

        if (!this.email.errors) {
            axios.post("/users/doesEmailExist", { email: this.email.value })
                .then((response) => {
                    if (response.data) {
                        this.email.isUnique = false;
                        this.showError(this.email, "That email is already being used")
                    }
                    else {
                        this.email.isUnique = true;
                        this.hideError(this.email);
                    }

                })
                .catch((error) => { console.error(error) })
        }
    }

    passwordImmediately() {
        if (this.password.value.length > 30) {
            this.showError(this.password, "Password cannot exceed 30 characters, will be difficult to remember")
        }

        if (!this.password.errors)
            this.hideError(this.password);
    }

    passwordAfterDelay() {
        if (this.password.value.length < 8)
            this.showError(this.password, "Password must be at least 8 characters");
    }

    showError(el, message) {
        let validationMessage = el.nextElementSibling.nextElementSibling || el.nextElementSibling;
        validationMessage.textContent = message;
        validationMessage.classList.add("visible");
        el.errors = true;
    }

    hideError(el) {
        if (el.nextElementSibling.nextElementSibling) {
            el.nextElementSibling.nextElementSibling.textContent = "";
            el.nextElementSibling.nextElementSibling.classList.remove("visible");
        }
        else {
            el.nextElementSibling.textContent = "";
            el.nextElementSibling.classList.remove("visible");
        }
    }
}


