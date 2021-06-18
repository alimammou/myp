import { getParticipants } from "../../api";
import { BaseParticipantStore, BaseParticipantType } from "../baseStore";

export class Participant extends BaseParticipantType {}

class Participants extends BaseParticipantStore {
  DataType = Participant;
  fetcher = getParticipants;
  filterProperty = "name";
  isUser = true;
}

const participantsStore = (window.part = new Participants());

export default participantsStore;
