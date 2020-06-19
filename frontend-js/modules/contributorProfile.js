export default class ContributorProfile {
    constructor() {
        this.editContactsBtn = document.getElementById("editContacts");
        this.editContactsForm = document.getElementById("editContactsForm");
        this.addContactWrapper = document.getElementById("addContactWrapper");
        this.contactsFieldWrapper = document.getElementById("contactsFieldWrapper");
        this.events();
    }

    //events

    events() {
        this.editContactsBtn.addEventListener("click", () => this.showEditForm());
    }

    //methods

    showEditForm() {
        this.editContactsForm.style.display = "block";
        this.getAddButtons();
    }

    getAddButtons() {

        const possibleContacts = ["facebook", "twitter", "github", "website"];
        this.inputFields = document.querySelectorAll("#editContactsForm input");
        let inputFieldIds = Array.from(this.inputFields).map((field) => field.id);
        let addContactButtons = [];
        this.addContactWrapper.innerHTML = "";
        possibleContacts.forEach((contact) => {
            if (!inputFieldIds.includes(contact)) {
                let addContactButton = document.createElement("button");
                addContactButton.setAttribute("class", "btn addContactButton");
                addContactButton.dataset.add = contact;
                addContactButton.textContent = `Add ${contact}`;
                addContactButtons.push(addContactButton);
                this.addContactWrapper.appendChild(addContactButton);
            }
        })
        this.addContactHandler(addContactButtons);
    }

    addContactHandler(addContactButtons) {
        addContactButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                this.addContactField(button);
            })
        })
    }

    removeContactHandler() {
        let removeContactButtons = document.querySelectorAll(".removeContactField");
        removeContactButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.removeContactField(button);
            })
        })
    }



    addContactField(button) {
        this.contactsFieldWrapper.insertAdjacentHTML("beforeend", `
        <fieldset>
        <label for="${button.dataset.add}">${button.dataset.add}</label>
        <span class="contactInputWrapper">
        <input type="url" id="${button.dataset.add}" name="${button.dataset.add}ProfileUrl" value="">
        <span class="removeContactField" data-remove="${button.dataset.add}">X</span>
        </span>
        </fieldset>
        `)
        button.parentElement.removeChild(button);
        this.removeContactHandler();
    }

    removeContactField(button) {
        button.parentElement.parentElement.parentElement.removeChild(button.parentElement.parentElement);
        this.getAddButtons();
    }

}