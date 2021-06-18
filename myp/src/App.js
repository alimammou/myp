import React, { Component } from "react";
import App from "grommet/components/App";
import Toast from "grommet/components/Toast";
import HomeScreen from "./screens/home";
import { plainRoutes } from "./routes";
import { Router, Switch, Route } from "react-router-dom";
import { observer } from "mobx-react";
import appStore from "./stores/app";
import { history } from "./stores/router";
import {localizer} from "./screens/home";
import WOW from "wowjs";

@observer
class Application extends Component {
  componentDidMount() {
    appStore.hookListeners();
    const wow = new WOW.WOW();
    wow.init();
  }

  componentWillUnmount() {
    appStore.unhookListeners();
  }

  renderToast() {
    const { notification } = appStore;
    if (notification)
      return <Toast {...notification}>{notification.message}</Toast>;
    return null;
  }

  render() {
    // const f = localizer.language;
    return (
      <Router history={history}>
        <App centered={false} rtl>
          {this.renderToast()}
          <Route exact={true} path="/" component={HomeScreen} />
          <Switch>
            {plainRoutes.map(route => (
              <Route
                key={route.path}
                exact={route.exact}
                path={route.path}
                component={route.component}
              />
            ))}
          </Switch>
        </App>
      </Router>
    );
  }
}

export default Application;
