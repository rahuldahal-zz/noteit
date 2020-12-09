import axios from "axios";

export default class UserQuery {
  constructor(jwt) {
    this.jwt = jwt;
    this.userQueryForm = document.getElementById("userQueryForm");
    console.log(userQueryForm);
    this.searchTerm = document.querySelector(
      '.searchUser input[name="searchTerm"]'
    );
    this.basedOn = document.querySelector('.searchUser select[name="basedOn"]');
    this.resultContainer = document.querySelector(".result__data");
    this.events();
  }

  //events

  events() {
    this.userQueryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendUserQuery(this.searchTerm.value, this.basedOn.value);
    });
  }

  //methods

  sendUserQuery(searchTermValue, basedOnValue) {
    axios
      .post("/api/admin/users", {
        searchTerm: searchTermValue,
        basedOn: basedOnValue,
        token: this.jwt,
      })
      .then((response) => {
        this.clearUserCard();
        if (Object.keys(response.data).length)
          this.createUserCard(response.data);
        else
          this.resultContainer.insertAdjacentHTML(
            "beforeend",
            `<h2>No users found</h2>`
          );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clearUserCard() {
    this.resultContainer.innerHTML = "";
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
      const {
        _id,
        name,
        firstName,
        picture,
        faculty,
        semester,
        email,
        roles,
        joinedOn,
        lastLogin,
      } = newUsersArray[i];

      let userCard = document.createElement("div");
      userCard.setAttribute("class", "user");

      userCard.innerHTML = `
                <div class="user__info">
                  <img src="${picture}" alt="${firstName} picture">
                  <div>
                    <h4>${name} </h4>
                    <p><em>${newUsersArray[
                      i
                    ].faculty.toUpperCase()}</em> <em> ${semester}</em></p>
                  </div>
                  </div>

                  <hr />

                  <p class="user__roles">
                    <i class="fas fa-user-tag"></i>
                    ${roles
                      .map(
                        (role) => `<span class="${role}Badge">${role}</span>`
                      )
                      .join("")}
                  </p>
                
                <p class="user__email">
                  <i class="fas fa-at"></i>
                  <span>${email}</span> 
                </p>

                <p class="user__joinedOn">
                  <i class="fas fa-sign-in-alt"></i>
                  <span>${joinedOn.date}/${joinedOn.month}/${
        joinedOn.year
      }</span>
                </p>


                <p class="user__lastLogin">
                  <i class="fas fa-calendar-check"></i>
                  <span>${lastLogin}</span>
                </p>

                <hr />

                </div>
            `;
      this.setActions(newUsersArray[i], userCard);

      this.resultContainer.appendChild(userCard);
    }
    this.actionsHandler();
  }

  setActions(user, userCard) {
    let actions = [];

    //approval
    if (user.isApproved)
      actions.push({
        userId: user._id,
        action: "/admin/users/disapprove",
        value: "Disapprove",
      });
    else
      actions.push({
        userId: user._id,
        action: "/admin/users/approve",
        value: "Approve",
      });

    //subscription
    if (user.isSubscriptionExpired)
      actions.push({
        userId: user._id,
        action: "/admin/users/renewSubscription",
        value: "Renew Subscription",
      });
    else
      actions.push({
        userId: user._id,
        action: "/admin/users/expireSubscription",
        value: "Expire Subscription",
      });
    this.addActionsToDOM(actions, userCard);
  }

  addActionsToDOM(actions, userCard) {
    let actionsContainer = document.createElement("div");
    actionsContainer.setAttribute("class", "actionsContainer");
    actions.forEach((action) => {
      actionsContainer.insertAdjacentHTML(
        "beforeend",
        `
                <form action="/api${action.action}" method="POST" class="adminAction">
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
      .put(action.action, { userId: userId, token: this.jwt })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }
}
