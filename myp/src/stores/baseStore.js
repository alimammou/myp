import { observable, action, computed } from "mobx";
import userStore from "./user";

export class BaseType {
  deleter;
  updater;
  parentStore;

  @observable
  isEditing = false;

  @observable
  askDelete = false;

  @observable
  isSyncing = false;

  constructor(args) {
    Object.keys(args).forEach(key => {
      this[key] = args[key];
    });
  }

  @action.bound
  delete() {
    this.askDelete = false;
    this.isSyncing = true;
    this.deleter({ id: this.id }).then(() =>
      this.parentStore.data.remove(this)
    );
  }

  @action.bound
  update(data) {
    this.isSyncing = true;

    this.updater({ id: this.id, data }).then(({ data }) => {
      this.isEditing = false;
      this.isSyncing = false;
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });
    });
  }
}

export class BaseParticipantType {
  parentStore;

  @observable
  isSyncing = false;

  constructor(args) {
    Object.keys(args).forEach(key => {
      this[key] = args[key];
    });
  }
}

export default class BaseStore {
  @observable
  data = [];

  @observable
  filterKeyword;

  filterProperty;

  @computed
  get filteredData() {
    if (this.filterKeyword && this.filterProperty) {
      return this.data.filter(f =>
        f[this.filterProperty]
          .toLowerCase()
          .match(this.filterKeyword.toLowerCase())
      );
    } else return this.data;
  }

  @observable
  isFetching = false;

  @observable
  isPosting = false;

  @observable
  didFetch = false;

  fetcher;
  itemFetcher;
  poster;

  DataType;

  @action.bound
  fetchItem(id) {
    if (!this.didFetch && !this.isFetching) {
      this.fetch("BaseStoreFetchItem");
    }
    if (!this.isFetching) {
      this.itemFetcher({ id })
        .then(({ data }) => {
          this.data.push(new this.DataType(data));
        })
        .catch(e => {});
    }
  }

  @action.bound
  fetch() {
    if (this.fetcher instanceof Function) {
      if (!this.isFetching) {
        this.isFetching = true;
        this.doReq();
        this.fetcher()
          .then(({ data }) => {
            data.map(d => this.data.push(new this.DataType(d)));
              this.isFetching = false;

            this.didFetch = true;
          })
          .catch(e => {
            this.didFetch = false;
          });
      }
    } else {
      console.log(
        "%c%s%c was expected to be a %c%s%c",
        "color: orange",
        `"fetcher"`,
        "color: inherit",
        "color: blue",
        `promise`,
        "color: green"
      );
    }
  }

  @action.bound
  post(data, callback = () => {}) {
    this.isPosting = true;
    this.poster({ data })
      .then(({ data }) => {
        this.data.push(new this.DataType(data));
        this.isPosting = false;
        callback();
      })
      .catch(e => {
        this.isPosting = false;
      });
  }

  @action
  doReq() {}

  getItem(id) {
    if (!this.didFetch && !this.isFetching) {
      this.fetch("BaseStoreGetItem");
    }
    return this.data.find(app => app.id == id);
  }

  get(id) {
    if (!this.didFetch && !this.isFetching) {
      this.fetch("BaseStoreGetItem");
    }

    return this.data.find(app => app.id == id);
  }
}

export class BaseParticipantStore {
  @observable
  data = [];

  @observable
  filterKeyword;

  filterProperty;

  @computed
  get filteredData() {
    if (this.filterKeyword && this.filterProperty) {
      return this.data.filter(f =>
        f[this.filterProperty]
          .toLowerCase()
          .match(this.filterKeyword.toLowerCase())
      );
    } else return this.data;
  }

  @observable
  isFetching = false;

  @observable
  didFetch = false;

  fetcher;
  itemFetcher;

  DataType;

  isUser;

  @action.bound
  fetchItem(id) {
    if (!this.didFetch && !this.isFetching) {
      this.fetch("BaseStoreFetchItem");
    }
    if (!this.isFetching) {
      this.itemFetcher({ id })
        .then(({ data }) => {
          this.data.push(new this.DataType(data));
        })
        .catch(e => {});
    }
  }

  @action.bound
  fetch() {
    if (this.fetcher instanceof Function) {
      if (!this.isFetching) {
        this.isFetching = true;
        this.didFetch = true;
        this.doReq();
        this.fetcher()
          .then(({ data }) => {
            data.map(d => {
              if (this.isUser) {
                if (d.id != userStore.user.id)
                  this.data.push(new this.DataType(d));
              } else {
                this.data.push(new this.DataType(d));
              }
            });
            this.postFetch();
            this.isFetching = false;
          })
          .catch(e => {
            this.didFetch = false;
          });
      }
    } else {
      console.log(
        "%c%s%c was expected to be a %c%s%c",
        "color: orange",
        `"fetcher"`,
        "color: inherit",
        "color: blue",
        `promise`,
        "color: green"
      );
    }
  }

  @action
  postFetch() {}
  @action
  doReq() {}

  getItem(id) {
    if (!this.didFetch && !this.isFetching) {
      this.fetch("BaseStoreGetItem");
    }
    return this.data.find(app => app.id == id);
  }

  get(id) {
    if (!this.didFetch && !this.isFetching) {
      this.fetch("BaseStoreGetItem");
    }

    return this.data.find(app => app.id == id);
  }
}
