import { sendRequest } from "./registration";

export default class Login {
    constructor() {
        this.username = document.getElementById("loginUsername");
        this.password = document.getElementById("loginPassword");
        this.loginForm = document.getElementById("loginForm");
        console.log(this.loginForm);
        this.events();
    }

    //events

    events() {
        this.loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.verifyLogin();
        });
    }

    //methods

    //the "axios" sends "password" in plain text...fix it
    verifyLogin() {
        if (!this.checkIfExists("notes")) {
            sendRequest("/users/login", { username: this.username.value, password: this.password.value, hasNotesInLocalStorage: false });
        }
        else {
            if (this.deleteNotes())
                sendRequest("/users/login", { username: this.username.value, password: this.password.value, hasNotesInLocalStorage: false });
        }
    }

    checkIfExists(item) {
        if (localStorage.getItem(item)) return true;
        return false;
    }


    deleteNotes() {
        localStorage.removeItem("notes");
        return true;
    }
}