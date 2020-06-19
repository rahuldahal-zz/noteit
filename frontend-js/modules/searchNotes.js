import axios from "axios";
export default class SearchNotes {
    constructor() {
        this.searchButton = document.getElementById("searchNoteBtn");
        this.injectSearchOverlay();
        this.searchOverlay = document.getElementById("searchOverlay");
        this.closeOverlay = document.getElementById("closeOverlay");
        this.searchField = document.getElementById("searchField");
        this.resultsArea = document.getElementById("searchResults");
        this.loaderIcon = document.getElementById("circleLoader");
        this.typingWaitTimer;
        this.previousValue = "";
        this.events();
    }

    //events

    events() {
        if (this.searchButton) {
            this.searchButton.addEventListener("click", () => this.showSearchOverlay());
            this.closeOverlay.addEventListener("click", () => this.hideSearchOverlay());
            this.searchField.addEventListener("keyup", () => this.keyPressHandler());
        }
    }

    //methods

    injectSearchOverlay() {
        document.body.insertAdjacentHTML("beforeend", `
        <div id="searchOverlay" class="flex">
            <div id="searchFieldContainer">
                <fieldset>
                    <label for="searchField">Search Term: </label>
                    <input id="searchField" type="text" placeholder="title of the unit..." class="p10">
                </fieldset>
                <button id="closeOverlay" class="btn m10">Close</button>
            </div>
            <div id="circleLoader"></div>
            <div id="searchResults" class="pl10">
            </div>
        </div>
        `)
    }

    showSearchOverlay() {
        this.searchOverlay.classList.add("search-overlay--visible");
        setTimeout(() => {
            this.searchField.focus();
        }, 50);
    }

    hideSearchOverlay() {
        this.searchOverlay.classList.remove("search-overlay--visible");
        this.hideLoader();
        this.hideResultsArea();
    }

    showLoader() {
        this.loaderIcon.style.display = "block";
    }

    hideLoader() {
        this.loaderIcon.style.display = "none";
    }

    showResultsArea(results) {
        this.resultsArea.style.display = "flex";
        this.resultsArea.innerHTML = "";
        if (results.length) {
            this.resultsArea.innerHTML = `<strong id="searchCount">Results: ${results.length}</strong>`;
            this.resultsArea.insertAdjacentHTML("beforeend",
                results.map((result) => {
                    return (
                        `<a href="${result.url}" class="btn">${result.title} <small>${result.subject}</small></a>`
                    )
                }).join("")
            )
        }
        else {
            this.resultsArea.innerHTML = "<h2>No results Found</h2>"
        }
    }

    hideResultsArea() {
        this.resultsArea.style.display = "none";
    }

    keyPressHandler() {
        let value = this.searchField.value;
        if (value == "") {
            clearTimeout(this.typingWaitTimer);
            this.hideLoader();
            this.hideResultsArea();
        }
        if (value != "" && value != this.previousValue) {
            clearTimeout(this.typingWaitTimer);
            this.showLoader();
            this.hideResultsArea();
            this.typingWaitTimer = setTimeout(() => this.sendRequest(), 750);
        }

        this.previousValue = value;
    }

    sendRequest() {
        axios.post("/notes/search", { searchTerm: this.searchField.value })
            .then((response) => {
                console.log(response.data)
                this.showResultsArea(response.data);
                this.hideLoader();
            })
            .catch((error) => console.log(error));
    }
}