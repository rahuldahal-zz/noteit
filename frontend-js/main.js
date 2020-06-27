import Base from "./modules/base";
import LocalStorageHandler from "./modules/localStorageHandler";
import UserQuery from "./modules/adminOnly/userQuery";
import CreateNote from "./modules/adminOnly/createNote";
import NotesScreen from "./modules/notesScreen";
import SearchNotes from "./modules/searchNotes";
import ContributorProfile from "./modules/contributorProfile";
import SaveFacultyAndSemester from "./modules/saveFacultyAndSemester";

new Base();

if (document.getElementById("saveFacultyAndSemesterScreen")) {
    new SaveFacultyAndSemester();
}

if (document.getElementById("searchNoteBtn")) {
    new SearchNotes();
}

if (document.getElementById("welcomeScreen") || document.getElementById("notesScreen")) {
    new LocalStorageHandler();
}


if (document.getElementById("userQueryScreen")) {
    new UserQuery();
}

if (document.getElementById("createNoteScreen")) {
    new CreateNote();
}

if (document.getElementById("notesScreen")) {
    new NotesScreen()
}

if (document.getElementById("contributorProfileScreen")) {
    new ContributorProfile()
}

//flash messages
if (document.getElementById("flash-wrap")) {
    if (document.getElementById("flash-wrap").childElementCount) {
        const flash = document.getElementById("flash-wrap");
        flash.classList.add("visible");
        flash.addEventListener("click", function () { flash.classList.remove("visible") })
    }
}
