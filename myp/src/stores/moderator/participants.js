import { action, computed, observable } from "mobx";
import {
  deleteMainUser,
  getMainUser,
  getParticipants,
  updateMainUser
} from "../../api";
import BaseStore, { BaseType } from "../baseStore";
import committeeStore from "./commitees";
import partiesStore from "./parties";

class Participant extends BaseType {
  deleter = deleteMainUser;
  updater = updateMainUser;
  parentStore = participantsStore;

  @observable
  party;

  @computed
  get partyEntity() {
    return partiesStore.get(this.party.id);
  }

  @action.bound
  setParty(id) {
    this.party = { id };
  }

  @observable
  commity;

  @computed
  get committeeEntity() {
    return committeeStore.get(this.commity.id);
  }

  @action.bound
  setCommittee(id) {
    this.commity = { id };
  }
}

class ParticipantsStore extends BaseStore {
  fetcher = getParticipants;
  itemFetcher = getMainUser;
  DataType = Participant;
  filterProperty = "name";

  doReq() {
    if (!partiesStore.didFetch) {
      partiesStore.fetch("PartsStore");
    }
    if (!committeeStore.didFetch) {
      committeeStore.fetch();
    }
  }
}

const participantsStore = (window.participantsStore = new ParticipantsStore());

export default participantsStore;
