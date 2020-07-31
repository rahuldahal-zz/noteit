import axios from "axios";

export default class UserQuery {
  constructor() {
    this._csrf = document.querySelector('[name="_csrf"]').value;
    this.userQuery = document.querySelector('[action="/admin/userQuery"]');
    this.searchTerm = document.querySelector(
      "#userQueryScreen input[name=searchTerm]"
    );
    this.basedOn = document.querySelector(
      "#userQueryScreen select[name=basedOn]"
    );
    this.userCardContainer = document.getElementById("userCardContainer");
    this.events();
  }

  //events

  events() {
    this.userQuery.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendUserQuery(this.searchTerm.value, this.basedOn.value);
    });
  }

  //methods

  sendUserQuery(searchTermValue, basedOnValue) {
    axios
      .post("/admin/userQuery", {
        searchTerm: searchTermValue,
        basedOn: basedOnValue,
        _csrf: this._csrf,
      })
      .then((response) => {
        this.clearUserCard();
        if (Object.keys(response.data).length)
          this.createUserCard(response.data);
        else
          this.userCardContainer.insertAdjacentHTML(
            "beforeend",
            `<h2>No users found</h2>`
          );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clearUserCard() {
    this.userCardContainer.innerHTML = "";
  }

  createUserCard(users) {
    let newUsersArray = [];
    try {
      newUsersArray.push(...users); //if multiple users, "spread" and push
    } catch {
      newUsersArray.push(users); //if single user, simply push
    }
    console.log(newUsersArray);
    for (let i = 0; i < newUsersArray.length; i++) {
      let userCard = document.createElement("div");
      userCard.setAttribute("class", "userCard");
      userCard.innerHTML = `
                <p>id: ${newUsersArray[i]._id} </p>
                <p>name: ${newUsersArray[i].name} </p>
                <p>email: ${newUsersArray[i].email} </p>
                <p>provider: ${newUsersArray[i].provider}</p>
                <p>sessionCount: ${newUsersArray[i].sessionCount}</p>
                <p>faculty: ${newUsersArray[i].faculty} </p>
                <p>semester: ${newUsersArray[i].semester} </p>
                <p>joinedOn: ${newUsersArray[i].joinedOn.date}/${
        newUsersArray[i].joinedOn.month
      }/${newUsersArray[i].joinedOn.year}</p>
                <ul>
                    ${newUsersArray[i].roles
                      .map((role) => `<li>${role}</li>`)
                      .join("")}
                </ul>
            `;
      this.setActions(newUsersArray[i], userCard);

      this.userCardContainer.appendChild(userCard);
    }
    this.actionsHandler();
  }

  setActions(user, userCard) {
    let actions = [];

    //approval
    if (user.isApproved)
      actions.push({
        userId: user._id,
        action: "/admin/disapprove-single",
        value: "Disapprove",
      });
    else
      actions.push({
        userId: user._id,
        action: "/admin/approve-single",
        value: "Approve",
      });

    //subscription
    if (user.isSubscriptionExpired)
      actions.push({
        userId: user._id,
        action: "/admin/renewSubscription-single",
        value: "Renew Subscription",
      });
    else
      actions.push({
        userId: user._id,
        action: "/admin/expireSubscription-single",
        value: "Expire Subscription",
      });

    //roles
    if (user.roles.length > 1) {
      user.roles.forEach((role) => {
        switch (role) {
          case "contributor":
            actions.push({
              userId: user._id,
              action: "/admin/removeAsContributor",
              value: "Remove as Contributor",
            });
        }
      });
    } else {
      actions.push({
        userId: user._id,
        action: "/admin/makeContributor",
        value: "Make Contributor",
      });
    }

    this.addActions(actions, userCard);
  }

  addActions(actions, userCard) {
    let actionsContainer = document.createElement("div");
    actionsContainer.setAttribute("class", "actionsContainer");
    actions.forEach((action) => {
      actionsContainer.insertAdjacentHTML(
        "beforeend",
        `
                    <form action="${action.action}" method="POST" class="adminAction">
                         <input type="hidden" value="${action.userId}" name="userId">
                         <button type="submit">${action.value}</button>
                </form>
            `
      );
    });
    userCard.appendChild(actionsContainer);
  }

  actionsHandler() {
    let actions = document.querySelectorAll(".adminAction");
    actions.forEach((action) => {
      action.addEventListener("submit", (e) => {
        e.preventDefault();
        this.doTheAction(action);
      });
    });
  }

  doTheAction(action) {
    let userId = action.firstElementChild.value;
    axios
      .post(action.action, { userId: userId, _csrf: this._csrf })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
}
