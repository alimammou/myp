import { observable, action } from "mobx";
import Responsive from "grommet/utils/Responsive";

class App {
  @observable
  loggedIn = false;

  @observable
  loaded = false;

  @observable
  user = "Test";

  @observable
  notification = null;

  @observable
  isMobile = false;

  _responsive;

  @action.bound
  notify({ status, message, onClose }) {
    if (typeof onClose === "undefined") {
      onClose = () => {
        this.notification = null;
      };
    } else {
      onClose = () => {
        onClose();
        this.notification = null;
      };
    }

    this.notification = {
      status,
      message,
      onClose
    };
  }

  @action.bound
  hookListeners() {
    this._responsive = Responsive.start(isMobile => {
      this.isMobile = isMobile;
    });
  }

  @action.bound
  unhookListeners() {
    this._responsive.stop();
  }
}

const app = (window.app = new App());
export default app;
