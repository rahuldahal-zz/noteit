import CreateNote from "./createNote";
import UserQuery from "./userQuery";
import ContributorsHandler from "./contributors";

export default class AdminDashboard {
  constructor() {
    this.jwt = document.querySelector('[type="hidden"]').value;
    new CreateNote(this.jwt);
    new UserQuery(this.jwt);
    new ContributorsHandler(this.jwt);
    this.events();
  }

  // events
  events() {}

  // methods
}
