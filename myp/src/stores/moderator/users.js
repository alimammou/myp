import { action, observable } from "mobx";
import {
  deleteMainUser,
  getAdmins,
  postMainUser,
  updateMainUser,
  updateUser
} from "../../api";
import BaseStore, { BaseType } from "../baseStore";
import userStore from "../user";

class Moderator extends BaseType {
  @observable
  name;

  @observable
  party;

  @observable
  commity;

  parentStore = moderatorsStore;
  deleter = deleteMainUser;
  updater = updateMainUser;

  @action.bound
  assignToParty(party) {
    this.isSyncing = true;
    if (party)
      updateUser({
        id: this.id,
        data: { party: `/parties/${party.id}` }
      }).then(resp => {
        this.isSyncing = false;
        this.party = { id: party.id, name: party.name };
      });
    else
      updateUser({
        id: this.id,
        data: { party: null }
      }).then(resp => {
        this.isSyncing = false;
        this.party = null;
      });
  }

  @action.bound
  assignToCommittee(commity) {
    this.isSyncing = true;
    if (commity)
      updateUser({
        id: this.id,
        data: { commity: `/commities/${commity.id}` }
      }).then(resp => {
        this.isSyncing = false;
        this.commity = { id: commity.id, name: commity.name };
      });
    else
      updateUser({
        id: this.id,
        data: { commity: null }
      }).then(resp => {
        this.isSyncing = false;
        this.commity = null;
      });
  }
}

class Moderators extends BaseStore {
  @observable
  users = [];
  fetcher = getAdmins;
  poster = postMainUser;
  DataType = Moderator;
  filterProperty = "name";

  @action.bound
  fetch() {
    if (!this.isFetching) {
      this.isFetching = true;
      this.didFetch = true;
      this.doReq();
      this.fetcher()
        .then(({ data }) => {
          data.map(d =>
            d.id !== userStore.user.id
              ? this.data.push(new this.DataType(d))
              : null
          );
          this.isFetching = false;
        })
        .catch(e => {
          this.didFetch = false;
        });
    }
  }
}

export const roles = {
  ROLE_MODERATOR: "Moderator",
  ROLE_COACH: "Mentor"
};

const moderatorsStore = (window.moderatorsStore = new Moderators());

export default moderatorsStore;
