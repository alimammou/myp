import { action, computed, observable } from "mobx";
import { getMainUser, parseMedia } from "../../api";
import BaseStore from "../baseStore";
import userStore from "../user";
import participantsStore from "./participantsStore";

class CoachStore extends BaseStore {
  @observable
  profile;

  @observable
  party;

  @observable
  commitee;

  @observable
  documents = [];

  @observable
  name = "";

  @observable
  didFetchParts = false;

  @action.bound
  fetch() {
    this.isFetching = true;
    getMainUser({ id: userStore.user.id }).then(({ data }) => {
      this.name = data.name;
      this.party = data.party ? new Party(data.party, "party") : null;
      this.commitee = data.commity ? new Party(data.commity, "commitee") : null;
      this.isFetching = false;
      this.didFetch = true;
    });
  }
}

const coachStore = (window.participantStore = new CoachStore());

export default coachStore;

export class Party {
  @observable
  isEditing = false;

  @observable
  askDelete = false;

  @observable
  name;

  @observable
  image;

  @observable
  isSyncing = false;

  @observable
  filterKeyword;

  // @observable
  // members = [];

  @computed
  get members() {
    if (!participantsStore.didFetch) {
      participantsStore.fetch();
    }

    return this.type === "party"
      ? participantsStore.data.filter(d => d.party && d.party.id == this.id)
      : participantsStore.data.filter(
          d => d.commity && d.commity.id == this.id
        );
    // return participantsStore.data.filter(d => d.party && d.party.id == this.id);
  }

  @observable
  isFetching = false;

  @observable
  didFetch = false;

  @computed
  get imageUrl() {
    return this.image ? parseMedia(this.image.contentUrl) : "";
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

  constructor(args, type) {
    Object.keys(args).forEach(key => {
      this[key] = args[key];
    });
    this.type = type;
  }
}
