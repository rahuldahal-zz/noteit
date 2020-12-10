import axios from "axios";

let eventAttachedToForm = false;
export default class UserQuery {
  constructor(jwt) {
    this.jwt = jwt;
    this.userQueryForm = document.getElementById("userQueryForm");
    this.searchTerm = document.querySelector(
      '.searchUser input[name="searchTerm"]'
    );
    this.basedOn = document.querySelector('.searchUser select[name="basedOn"]');
    this.resultDataContainer = document.querySelector(".result__data");
    this.resultTitleContainer = document.querySelector(".result__title");
    this.events();
  }

  //events

  events() {
    !eventAttachedToForm &&
      this.userQueryForm.addEventListener("submit", (e) => {
        eventAttachedToForm = true;
        e.preventDefault();
        this.sendUserQuery(this.searchTerm.value, this.basedOn.value);
      });
  }

  //methods

  sendUserQuery(searchTermValue, basedOnValue) {
    this.clearUserCard();
    axios
      .post("/api/admin/users", {
        searchTerm: searchTermValue,
        basedOn: basedOnValue,
        token: this.jwt,
      })
      .then((response) => {
        if (response.status === 200) {
          this.createUserCard(response.data);
          this.updateResultTitle(response.data.users.length);
        } else {
        }
      })
      .catch(({ response }) => {
        if (response.status === 400) {
          this.resultDataContainer.insertAdjacentHTML(
            "beforeend",
            `<h2>${response.data.error}</h2>`
          );
        } else {
          console.log(response);
        }
      });
  }

  updateResultTitle(resultCount) {
    document.querySelector(
      ".result__searchTerm"
    ).textContent = this.searchTerm.value;
    document.querySelector(".result__basedOn").textContent = this.basedOn.value;
    document.querySelector(".result__count").textContent = resultCount;
  }

  clearUserCard() {
    console.log("clearing...");
    this.resultDataContainer.innerHTML = "";
  }

  createUserCard({ users }) {
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
                  <span>${email ? email : "N/A"}</span> 
                </p>

                <p class="user__joinedOn">
                  <i class="fas fa-sign-in-alt"></i>
                  <span>${joinedOn.date}/${joinedOn.month}/${
        joinedOn.year
      }</span>
                </p>


                <p class="user__lastLogin">
                  <i class="fas fa-calendar-check"></i>
                  <span>${lastLogin.date}/${lastLogin.month}/${
        lastLogin.year
      }</span><em>${lastLogin.timeAgo}</em>
                </p>

                <hr />

                </div>
            `;
      this.setActions(newUsersArray[i], userCard);

      this.resultDataContainer.appendChild(userCard);
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
