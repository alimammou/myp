import { action, computed, observable } from "mobx";
import moment from "moment";
import {
  getEndorsements,
  getGenericDocuments,
  getMainUser,
  parseMedia
} from "../../api";
import BaseStore from "../baseStore";
import { Application } from "../moderator/applications";
import userStore from "../user";
import participantsStore from "./participantsStore";

class ParticipantStore extends BaseStore {
  @observable
  profile;

  @observable
  party;

  @observable
  commitee;

  @observable
  documents = [];

  @observable
  didFetchDocuments = false;

  @computed
  get allDocuments() {
    if (!this.didFetchDocuments) {
      this.fetchDocuments();
    }
    return [
      ...this.documents,
      ...(this.party ? this.party.documents : []),
      ...(this.commitee ? this.commitee.documents : [])
    ];
  }

  @observable
  didFetchParts = false;

  @action.bound
  fetch() {
    this.isFetching = true;
    getMainUser({ id: userStore.user.id }).then(({ data }) => {
      this.profile = new Application(data.userProfile);
      this.party = data.party ? new Party(data.party, "party") : null;
      this.commitee = data.commity ? new Party(data.commity, "commitee") : null;
      this.postFetch();
    });
  }

  @action.bound
  fetchDocuments() {
    this.didFetchDocuments = true;
    getGenericDocuments().then(({ data }) => {
      this.documents = data;
    });
  }

  @observable
  endorsements = [];

  @computed
  get stars() {
    if (!this.didFetchParts) {
      this.postFetch();
      return 0;
    }
    const today = this.endorsements.filter(d => {
      return moment().isSame(d.date, "day");
    });

    return 5 - today.length;
  }

  @computed
  get canEndorce() {
    return this.stars > 0;
  }

  @action.bound
  postFetch = () => {
    getEndorsements({ id: userStore.user.id }).then(({ data }) => {
      this.endorsements = data;
      this.didFetchParts = true;
      this.isFetching = false;
      this.didFetch = true;
    });
  };
}

const participantStore = (window.participantStore = new ParticipantStore());

export default participantStore;

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

  // @action.bound
  // fetch() {
  //   this.isFetching = true;
  //   this.type === "party"
  //     ? getParty({ id: this.id }).then(({ data }) => {
  //         data.users.map(d => this.members.push(new Participant(d)));
  //         this.isFetching = false;
  //         this.didFetch = true;
  //       })
  //     : getCommity({ id: this.id }).then(({ data }) => {
  //         data.users.map(d => this.members.push(new Participant(d)));
  //         this.isFetching = false;
  //         this.didFetch = true;
  //       });
  // }

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
