import { action, computed } from "mobx";
import { getParticipants, postEndorsement } from "../../api";
import appStore from "../app";
import { BaseParticipantStore, BaseParticipantType } from "../baseStore";
import userStore from "../user";
import partStore from "./participantStore";

export class Participant extends BaseParticipantType {
  @action.bound
  generalEndorse(type) {
    if (partStore.canEndorce) {
      this.isSyncing = true;

      const data = {
        sender: `/users/${userStore.user.id}`,
        reciever: `/users/${this.id}`,
        type
      };
      partStore.endorsements.push({
        senderId: userStore.user.id,
        recieverId: this.id,
        date: new Date(),
        type
      });
      postEndorsement({ data }).then(({ data }) => (this.isSyncing = false));
    } else {
      appStore.notify({
        status: "warning",
        message:
          "You don't have any endorsement points left, please try again tommorow."
      });
    }
  }

  endorseLeadership = () => {
    this.generalEndorse("leadership");
  };
  endorseContent = () => {
    this.generalEndorse("content");
  };
  endorseManagement = () => {
    this.generalEndorse("management");
  };

  @computed
  get endorsements() {
    return partStore.endorsements.filter(d => d.recieverId == this.id);
  }

  @computed
  get leadership() {
    return this.endorsements.filter(d => d.type === "leadership").length;
  }

  @computed
  get content() {
    return this.endorsements.filter(d => d.type === "content").length;
  }

  @computed
  get management() {
    return this.endorsements.filter(d => d.type === "management").length;
  }
}

class Participants extends BaseParticipantStore {
  DataType = Participant;
  fetcher = getParticipants;
  filterProperty = "name";
  isUser = true;
  postFetch() {
    if (!partStore.didFetch) {
      partStore.postFetch();
    }
  }
}

const participantsStore = (window.part = new Participants());

export default participantsStore;
