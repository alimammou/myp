import { action, computed, observable } from "mobx";
import {
  deleteParty,
  getParties,
  parseMedia,
  postImage,
  postParty,
  updateParty
} from "../../api";
import { createImageEntity } from "../../helpers";
import BaseStore from "../baseStore";
import participantStore from "./participants";

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

  @computed
  get imageUrl() {
    return this.image ? parseMedia(this.image.contentUrl) : "";
  }

  @computed
  get members() {
    return participantStore.data.filter(
      part => (part.party ? part.party.id === this.id : false)
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

  constructor(args) {
    Object.keys(args).forEach(key => {
      this[key] = args[key];
    });
  }

  @action.bound
  delete() {
    this.askDelete = false;
    this.isSyncing = true;
    deleteParty({ id: this.id }).then(() => partiesStore.data.remove(this));
  }

  @action.bound
  update(data) {
    this.isSyncing = true;
    if (data.image) {
      const formData = new FormData();
      formData.append("file", data.image);
      postImage({ data: formData }).then(resp =>
        updateParty({
          id: this.id,
          data: { ...data, image: createImageEntity(resp.data.id) }
        }).then(({ data }) => {
          this.isEditing = false;
          this.isSyncing = false;
          Object.keys(data).forEach(key => {
            this[key] = data[key];
          });
        })
      );
    } else {
      updateParty({ id: this.id, data }).then(({ data }) => {
        this.isEditing = false;
        this.isSyncing = false;
        Object.keys(data).forEach(key => {
          this[key] = data[key];
        });
      });
    }
  }
}

class Parties extends BaseStore {
  filterProperty = "name";

  DataType = Party;

  @action.bound
  fetch() {
    if (!this.isFetching) {
      this.isFetching = true;

      getParties()
        .then(({ data }) => {
          data.map(party => this.data.push(new Party(party)));
          this.isFetching = false;
          this.didFetch = true;
          if (!participantStore.didFetch) {
            participantStore.fetch();
          }
        })
        .catch(e => {
          this.didFetch = false;
        });
    }
  }

  @action.bound
  post(data) {
    this.isPosting = true;
    if (data.image) {
      const formData = new FormData();
      formData.append("file", data.image);
      postImage({ data: formData }).then(resp => {
        postParty({
          data: { ...data, image: createImageEntity(resp.data.id) }
        }).then(({ data }) => this.data.push(new Party(data)));
        this.isPosting = false;
      });
    } else {
      postParty({ data }).then(({ data }) => {
        this.data.push(new Party(data));
        this.isPosting = false;
      });
    }
  }
}

const partiesStore = (window.partiesStore = new Parties());

export default partiesStore;
