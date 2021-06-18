import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import createBrowserHistory from "history/createBrowserHistory";

export const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

window.router = routingStore;

export const history = syncHistoryWithStore(browserHistory, routingStore);

export default routingStore;
