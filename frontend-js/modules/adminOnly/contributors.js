import axios from "axios";

let eventAttachedToForm = false;

export default class ContributorQuery {
  constructor(jwt) {
    this.jwt = jwt;
    this.form = document.getElementById("contributorHandlerForm");
    this.resultContainer = document.querySelector(".result__data");
    this.events();
  }

  events() {
    !eventAttachedToForm &&
      this.form.addEventListener("submit", (e) => {
        eventAttachedToForm = true;
        e.preventDefault();
        axios
          .post("/api/admin/contributors", { token: this.jwt })
          .then((response) => this.populateContributors(response.data))
          .catch((error) => console.error(error));
      });
  }

  populateContributors(contributors) {
    this.resultContainer.innerHTML = "";
    for (let i = 0; i < contributors.length; i++) {
      let contributorCard = document.createElement("div");
      contributorCard.setAttribute("class", "contributorCard");
      contributorCard.innerHTML = `
                <p>id: ${contributors[i]._id} </p>
                <p>name: ${contributors[i].name} </p>
                <p>joinedOn: ${contributors[i].joinedOn}</p>
            `;
      this.setActions(contributors[i], contributorCard);

      this.resultContainer.appendChild(contributorCard);
    }
    this.actionsHandler();
  }

  setActions(contributor, contributorCard) {
    let actions = [];

    //approval
    if (contributor.isApproved)
      actions.push({
        contributorId: contributor._id,
        action: "/api/admin/contributors/disapprove",
        value: "Disapprove",
      });
    else
      actions.push({
        contributorId: contributor._id,
        action: "/api/admin/contributors/approve",
        value: "Approve",
      });

    this.addActions(actions, contributorCard);
  }

  addActions(actions, contributorCard) {
    let actionsContainer = document.createElement("div");
    actionsContainer.setAttribute("class", "actionsContainer");
    actions.forEach((action) => {
      actionsContainer.insertAdjacentHTML(
        "beforeend",
        `
                        <form action="${action.action}" method="POST" class="contributorAction">
                             <input type="hidden" value="${action.contributorId}" name="contributorId">
                             <button type="submit">${action.value}</button>
                    </form>
                `
      );
    });
    contributorCard.appendChild(actionsContainer);
  }

  actionsHandler() {
    let actions = document.querySelectorAll(".contributorAction");
    actions.forEach((action) => {
      action.addEventListener("submit", (e) => {
        e.preventDefault();
        this.doTheAction(action);
      });
    });
  }

  doTheAction(action) {
    let contributorId = action.firstElementChild.value;
    axios
      .put(action.action, { contributorId: contributorId, token: this.jwt })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
}
