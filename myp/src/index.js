import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "intersection-observer";
import DevTools from "mobx-react-devtools";
import { AppContainer } from "react-hot-loader";
import "./scss/index.scss";
import "./assets/css/animate.css";
import userStore from "./stores/user";
import appStore from "./stores/app";
import localForage from "localforage";
import { AsyncTrunk } from "mobx-sync";

const trunk = new AsyncTrunk(userStore, { storage: localForage });

trunk.init().then(() => {
  /**
   * @desc do any staff with the loaded store,
   * and any changes now will be persisted
   * @type {boolean}
   */
  appStore.loaded = true;
});

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("content")
  );

const Container = () => (
  <React.Fragment>
    <App />
    {/* <DevTools /> */}
  </React.Fragment>
);

render(Container);
if (module.hot) {
  module.hot.accept("./App.js", () => {
    const NextRootContainer = require("./App").default;
    render(NextRootContainer);
  });
}

registerServiceWorker();
