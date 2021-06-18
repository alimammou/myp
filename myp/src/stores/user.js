import { observable, action, computed } from "mobx";
import { login, logout, api } from "../api";
import participantStore from "./participants/participantStore";
import router from "./router";

class User {
  constructor(data) {
    initFromJson(data, this);
  }

  @computed
  get user() {
    return this.prop + this.added;
  }
}

class UserStore {
  @observable
  user = null;

  @observable
  isLogging = false;

  @observable
  loginError = null;

  @computed
  get role() {
    return this.user ? this.user.role : "";
  }

  @computed
  get isLoggedIn() {
    return this.user !== null;
  }

  @action
  getCurrentUser() {
    api.get("currentUser");
  }

  @action
  login({ username, password }) {
    this.isLogging = true;
    login({ username, password })
      .then(({ data }) => {
        if ("success" in data) {
          throw "You haven't been accepted yet";
        }
        this.user = new User(data);
        if (this.user.role === roles.participant) {
          participantStore.fetch();
        }
        this.isLogging = false;
        if (this.loginError) this.loginError = null;
        router.replace("/dashboard");
      })
      .catch(e => {
        console.log(e);
        if (e instanceof Error)
          this.loginError = "Email or password is incorrect";
        else this.loginError = e;
        this.isLogging = false;
      });
  }

  @action.bound
  logout() {
    router.push("/");
    this.user = null;
    logout();
  }
}

const initFromJson = (object, targetClass) => {
  Object.keys(object).forEach(key => {
    targetClass[key] = object[key];
  });
};

const userStore = (window.user = new UserStore());

export const roles = {
  moderator: "ROLE_MODERATOR",
  coach: "ROLE_COACH",
  participant: "ROLE_PARTICIPANT"
};

export default userStore;
