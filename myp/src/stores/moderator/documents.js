import { computed } from "mobx";
import {
  deleteDocument,
  getDocuments,
  parseMedia,
  postDocument,
  updateDocument
} from "../../api";
import BaseStore, { BaseType } from "../baseStore";

export class Document extends BaseType {
  updater = updateDocument;
  deleter = deleteDocument;
  parentStore = documentStore;
  @computed
  get url() {
    return parseMedia(this.file);
  }
}

class DocumentStore extends BaseStore {
  DataType = Document;
  fetcher = getDocuments;
  poster = postDocument;

  @computed
  get genericDocuments() {
    return this.data.filter(d => d.isGeneric);
  }

  partyDocuments(id) {
    return this.data.filter(d => d.party === id);
  }

  commityDocuments(id) {
    return this.data.filter(d => d.commity === id);
  }
}

const documentStore = (window.docStore = new DocumentStore());

export default documentStore;
