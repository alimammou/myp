import { action, computed, observable } from "mobx";
import {
  deleteCommity,
  getCommitees,
  postCommity,
  updateCommity
} from "../../api";
import BaseStore from "../baseStore";
import participantStore from "./participants";

export class Commity {
  @observable
  isEditing = false;

  @observable
  askDelete = false;

  @observable
  name;

  @observable
  isSyncing = false;

  constructor(args) {
    Object.keys(args).forEach(key => {
      this[key] = args[key];
    });
  }

  @computed
  get members() {
    return participantStore.data.filter(
      part => (part.commity ? part.commity.id === this.id : false)
    );
  }

  @computed
  get filteredMembers() {
    if (this.filterKeyword) {
      return this.members.filter(f =>
        f["name"].toLowerCase().match(this.filterKeyword)
      );
    } else return this.members;
  }

  @computed
  get membersCount() {
    return this.members.length;
  }

  @action.bound
  delete() {
    this.askDelete = false;
    this.isSyncing = true;
    deleteCommity({ id: this.id }).then(() => commiteesStore.data.remove(this));
  }

  @action.bound
  update(data) {
    this.isSyncing = true;

    updateCommity({ id: this.id, data }).then(({ data }) => {
      this.isEditing = false;
      this.isSyncing = false;
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });
    });
  }
}

class Commitees extends BaseStore {
  DataType = Commity;
  fetcher = getCommitees;
  poster = postCommity;

  filterProperty = "name";

  // @action.bound
  // fetch() {
  //   if (!this.isFetching) {
  //     this.isFetching = true;
  //     getCommitees().then(({ data }) => {
  //       this.didFetch = true;
  //       data.map(commity => this.data.push(new Commity(commity)));
  //       this.isFetching = false;
  //     });
  //   }
  // }

  // @action.bound
  // post(data) {
  //   this.isPosting = true;
  //   postCommity({ data }).then(({ data }) => {
  //     this.data.push(new Commity(data));
  //     this.isPosting = false;
  //   });
  // }
}

const commiteesStore = (window.commiteesStore = new Commitees());

export default commiteesStore;
