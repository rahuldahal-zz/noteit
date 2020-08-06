import CreateNote from "./createNote";
import UserQuery from "./userQuery";

export default class AdminDashboard {
  constructor() {
    this.jwt = document.querySelector('[type="hidden"]').value;
    new CreateNote(this.jwt);
    new UserQuery(this.jwt);
    this.events();
  }

  // events
  events() {}

  // methods
}
