import { observable, action, computed } from "mobx";
import {
  getApplications,
  updateApplication,
  updateUser,
  deleteApplication,
  resendPasswordReminder
} from "../../api";
import router from "../router";
import participantStore from "./participants";
import appStore from "../app";
import moment from "moment";
import BaseStore from "../baseStore";

export class Application {
  @observable
  status = null;

  @observable
  name = null;

  @observable
  isSyncing = false;

  @observable
  askDelete = false;

  @computed
  get user() {
    return participantStore.get(this.userId);
  }

  get age() {
    return moment().diff(this.birthday, "years", false);
  }

  constructor(args) {
    Object.keys(args).forEach(key => {
      if (key === "user" && args[key] !== null) {
        Object.keys(args[key]).forEach(subkey => {
          if (subkey === "id") this.userId = args[key][subkey];
          else this[subkey] = args[key][subkey];
        });
      } else this[key] = args[key];
    });
  }

  @action.bound
  delete = (shouldNavBack = false) => () => {
    console.log(shouldNavBack);
    this.askDelete = false;
    this.isSyncing = true;
    if (shouldNavBack) {
      router.goBack();
    }
    deleteApplication({ id: this.id }).then(() => {
      applicationStore.data.remove(this);
    });
  };

  @action.bound
  accept() {
    this.status = "accepted";
    updateApplication({ id: this.id, data: { status: this.status } })
      .then(resp => participantStore.fetchItem(this.userId))
      .catch(e => console.log(e));
  }

  @action.bound
  reject() {
    this.status = "rejected";
    updateApplication({ id: this.id, data: { status: this.status } });
  }

  @action
  assignToParty(partyid) {
    this.isSyncing = true;
    updateUser({
      id: this.userId,
      data: { party: `/parties/${partyid}` }
    }).then(resp => {
      this.isSyncing = false;
      this.user.setParty(partyid);
    });
  }

  @action
  assignToCommittee(comid) {
    this.isSyncing = true;
    updateUser({
      id: this.userId,
      data: { commity: `/commities/${comid}` }
    }).then(resp => {
      this.isSyncing = false;
      this.user.setCommittee(comid);
    });
  }

  @action
  resendPasswordReminder = () => {
    resendPasswordReminder({ id: this.userId })
      .then(({ data }) => {
        console.log(data);
        if (data.success === "true") {
          appStore.notify({
            status: "ok",
            message: `Email was sent to ${this.name} successfully.`
          });
        } else {
          appStore.notify({
            status: "critical",
            message: `Something wrong happened, please try again later.`
          });
        }
      })
      .catch(e =>
        appStore.notify({
          status: "critical",
          message: `Something wrong happened, please try again later.`
        })
      );
  };
}

class ApplicationStore extends BaseStore {
  @observable
  applications = [];

  @observable
  isFetching = false;

  @observable
  didFetch = false;

  fetcher = getApplications;

  DataType = Application;

  filterProperty = "name";

  tempReq = participantStore;

  @computed
  get acceptedApplications() {
    return this.data.filter(app => app.status === "accepted");
  }

  @computed
  get pendingApplications() {
    return this.data.filter(app => app.status === "unknown");
  }

  @computed
  get rejectedApplications() {
    return this.data.filter(app => app.status === "rejected");
  }

  @computed
  get withPassword() {
    return this.data.filter(app => app.isPasswordSet === true);
  }

  @computed
  get didVerify(){
    return this.data.filter(app=>app.isVerified === true);
  }

  @action.bound
  fetch() {
    this.isFetching = true;
    if (!participantStore.didFetch && !participantStore.isFetching)
      participantStore.fetch();
    setTimeout(()=>getApplications().then(({ data }) => {
      this.isFetching = false;
      this.data = data.map(app => new Application(app));
      this.didFetch = true;
    }),5000);
  }

  getApplication(id) {
    return this.data.find(app => app.id == id);
  }
}

const applicationStore = (window.applicationStore = new ApplicationStore());

export default applicationStore;
