import CreateNote from "./createNote";
import UserQuery from "./userQuery";
import ContributorQuery from "./contributors";

export default class AdminDashboard {
  constructor() {
    this.jwt = document.querySelector('[type="hidden"]').value;
    this.sideNavItems = document.querySelectorAll(".sideNav__item");
    this.queryContainers = document.querySelectorAll(".queryContainer__query");
    this.queryTitle = document.querySelector(".queryContainer__title");
    new UserQuery(this.jwt);
    this.events();
  }

  // events
  events() {
    this.sideNavItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const target = e.currentTarget;

        switch (target.dataset.action) {
          case "user":
            this.activateTab(target, "user");
            this.queryTitle.textContent = "User Query";
            new UserQuery(this.jwt);
            break;
          case "contributor":
            this.activateTab(target, "contributor");
            this.queryTitle.textContent = "Contributor Query";
            new ContributorQuery(this.jwt);
            break;
          case "note":
            this.activateTab(target, "note");
            this.queryTitle.textContent = "Create Note";
            new CreateNote(this.jwt);
            break;
        }
      });
    });
  }

  activateTab(navTarget, queryContainer) {
    this.sideNavItems.forEach((item) =>
      item.classList.remove("sideNav__item--active")
    );
    navTarget.classList.add("sideNav__item--active");

    this.queryContainers.forEach((container) => {
      container.classList.remove("queryContainer__query--active");
      if (container.dataset.query === queryContainer) {
        container.classList.add("queryContainer__query--active");
      }
    });
  }

  // methods
}
