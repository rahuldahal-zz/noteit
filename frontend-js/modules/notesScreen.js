import axios from "axios";

export default class NotesScreen {
    constructor() {
        this.sideBar = document.getElementById("notesScreen-sidebar");
        this.unitsSideBarWrapper = document.getElementById("unitsSideBarWrapper");
        this.internalLinksSideBarWrapper = document.getElementById("internalLinksSideBarWrapper");
        this.currentNote;
        this.contributorName = document.getElementById("contributor__name");
        this.saveNoteForm = document.getElementById("saveNoteForm");
        this.hasSaved = false;
        this.getNotesFromLocalStorage();
        this.subTopics = document.querySelectorAll(".subTopic");
        this.events();
        this.internalLinksHandler();
    }

    //events

    events() {
        if (this.saveNoteForm) {
            this.saveNoteForm.addEventListener("submit", e => {
                e.preventDefault();
                if (this.saveNoteForm.firstElementChild.value) {
                    this.sendAsyncRequest("/notes/save", { noteId: this.saveNoteForm.firstElementChild.value });
                }
            })
        }
    }


    //methods

    getNotesFromLocalStorage() {
        let subjectWiseUnits = JSON.parse(localStorage.getItem("notes"));
        let subjects = Object.keys(subjectWiseUnits);

        //sorting the units bu "unitNo"
        subjects.forEach((subject) => {
            subjectWiseUnits[subject] = subjectWiseUnits[subject].sort((a, b) => a.unitNo - b.unitNo);
        })

        this.getCurrentNote(subjects, subjectWiseUnits);
        this.addInTheSidebar(subjects, subjectWiseUnits);
        this.handleUnitsToggle();

    }

    addInTheSidebar(subjects, subjectWiseUnits) {
        if (subjects.length) {
            subjects.forEach((subject) => {
                this.unitsSideBarWrapper.insertAdjacentHTML("beforeend", `
                    <div class="subject">
                        <div class="subject__header" tabindex="0">
                            <p>${subject}</p>
                            <strong>+</strong>
                        </div>
                        <div class="subject__units">
                ${subjectWiseUnits[subject].map((unit) => {
                    return `<a href="${unit.url}" class="subject__unit"><span>${unit.title}</span></a>`;
                }).join("")}
                        </div>
                    </div>
            `)
            })
        }
    }
    handleUnitsToggle() {
        const subjectHeaders = document.querySelectorAll(".subject__header");
        let isSubjectActive = false;
        subjectHeaders.forEach((header) => {
            header.addEventListener("click", (e) => {
                toggleTheUnits(e);
            })
        })

        function toggleTheUnits(e) {
            let itsSibling = e.currentTarget.nextElementSibling;
            if (!isSubjectActive) {
                let calculatedHeight = (window.innerHeight * 0.07) * itsSibling.childElementCount;
                itsSibling.style.height = calculatedHeight + "px";
                itsSibling.style.visibility = "visible";
                itsSibling.style.opacity = 1;
                isSubjectActive = true;
                console.log(calculatedHeight);
            }
            else {
                itsSibling.style.height = "0";
                itsSibling.style.visibility = "hidden";
                itsSibling.style.opacity = 0;
                isSubjectActive = false;
                console.log(isSubjectActive);

            }
        }

    }

    getCurrentNote(subjects, subjectWiseUnits) {
        let foundCurrentNote = false;
        let i = 0;
        do {
            this.currentNote = subjectWiseUnits[subjects[i]].filter((unit) => {
                if (unit.url == window.location.pathname) {
                    foundCurrentNote = true;
                    return unit;
                }
            });
            i++;
        }
        while (!foundCurrentNote);
        this.currentNote = this.currentNote[0];
        console.log(this.currentNote);
        this.creditContributor(this.currentNote.contributor);
    }

    creditContributor(contributor) {
        this.contributorName.textContent = contributor.username;
        this.contributorName.href = `/contributors/${contributor.username}`;
    }

    sendAsyncRequest(route, body) {
        axios.post(route, body)
            .then((response) => {
                if (response.status === 200)
                    this.toggleButtons(this.saveNoteForm.lastElementChild, "saveNote--saved", ["Save", "Saved"]);
            })
            .catch((error) => console.log(error));
    }

    internalLinksHandler() {
        this.internalLinksSideBarWrapper.insertAdjacentHTML("beforeend",
            Array.from(this.subTopics).map((subTopic) => {
                subTopic.parentElement.setAttribute("id", encodeURIComponent(subTopic.textContent));
                return `
                    <div class="internalLink">
                        <a href="#${encodeURIComponent(subTopic.textContent)}">${subTopic.textContent}</a>
                    </div>
                `
            }).join("")
        )
    }

    toggleButtons(targetElement, classToToggle, textContent) {
        if (!(targetElement && classToToggle)) return -1;
        targetElement.classList.toggle(classToToggle);
        if (textContent) {
            if (targetElement.textContent == textContent[0])
                targetElement.textContent = textContent[1];
            else targetElement.textContent = textContent[0];

        }

        return 0;
    }
}

