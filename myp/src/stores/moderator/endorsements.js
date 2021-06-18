import { observable, action, computed } from "mobx";
import { getModsEndorsements } from "../../api";


class Endorsement {
  @observable
  content = 0;

  @observable
  leadership = 0;

  @observable
  management = 0;

  @computed
  get total() {
    return this.content + this.leadership + this.management;
  }

  constructor({ userId, name, content = 0, leadership = 0, management = 0 }) {
    this.userId = userId;
    this.name = name;
    this.content = content;
    this.leadership = leadership;
    this.management = management;
  }
}

class Endorsements {
  @observable
  data = [];

  @computed
  get sortedData(){
      return this.data.slice().sort(c=>c.total).reverse();
  }

  @observable
  isFetching = false;

  @observable
  didFetch = false;

  @action.bound
  fetch() {
    if (!this.isFetching) {
      this.isFetching = true;
      getModsEndorsements().then(({ data }) => {
        let holder = new Endorsement({ userId: -1, name: "" });

        for (let i = 0; i < data.length; i++) {
          const d = data[i];
          
          if (holder.userId !== d.userId) {
            if (holder.userId !== -1) {
              this.data.push(holder);
            }
            holder = new Endorsement({ userId: d.userId, name: d.name });
          }
          console.log(holder);
          switch (d.type) {
            case "content": {
              holder.content = parseInt(d.endorsements);
              break;
            }

            case "management": {
              holder.management = parseInt(d.endorsements);
              break;
            }

            case "leadership": {
              holder.leadership = parseInt(d.endorsements);
              break;
            }

            case "total": {
              this.data.push(holder);
              break;
            }

            default:
              break;
          }
        }
        this.data.push(holder);
      });
    }
  }
}

const endorsementStore = (window.modEndStore = new Endorsements());

export default endorsementStore;
