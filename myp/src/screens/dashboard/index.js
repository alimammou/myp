import Anchor from "grommet/components/Anchor";
import Animate from "grommet/components/Animate";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import AddIcon from "grommet/components/icons/base/Add";
import CloseIcon from "grommet/components/icons/base/Close";
import MenuIcon from "grommet/components/icons/base/Menu";
import StarIcon from "grommet/components/icons/base/Star";
import UserIcon from "grommet/components/icons/base/User";
import Layer from "grommet/components/Layer";
import Headline from "grommet/components/Headline";
import Menu from "grommet/components/Menu";
import Sidebar from "grommet/components/Sidebar";
import Split from "grommet/components/Split";
import Title from "grommet/components/Title";
import Value from "grommet/components/Value";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import appStore from "../../stores/app";
import partStore from "../../stores/participants/participantStore";
import partsStore from "../../stores/participants/participantsStore";
import Spinner from "grommet/components/icons/Spinning";
import router from "../../stores/router";
import userStore from "../../stores/user";
import dashRoutes from "./routes";

@observer
export default class DashboardScreen extends React.Component {
  @observable
  editing = false;

  @computed
  get didLoadEverything() {
    let didLoad = true;
    if (userStore.role === "ROLE_PARTICIPANT") {
      didLoad =
        partStore.didFetch &&
        partsStore.didFetch &&
        partStore.didFetchDocuments;
    }
    return didLoad;
  }

  fetchEverything() {
    if (!partStore.didFetch) {
      partStore.fetch();
    }
    if (!partsStore.didFetch) {
      partsStore.fetch();
    }
    if (!partStore.didFetchDocuments) {
      partStore.fetchDocuments();
    }
  }

  constructor() {
    super();

    this._onResponsive = this._onResponsive.bind(this);
    this.state = {
      sidebarActive: true
    };
  }

  componentDidMount() {
    if (!userStore.isLoggedIn && appStore.loaded) {
      router.replace("/login");
    }
  }

  _onResponsive(responsive) {
    if ("single" === responsive) {
      this.setState({
        responsive,
        sidebarActive: false
      });
    } else
      this.setState({
        responsive,
        sidebarActive: true
      });
  }

  _onSwitchEditor = () => {
    this.editing = !this.editing;
  };

  _onSwitchSidebar = () => {
    this.setState({
      sidebarActive: !this.state.sidebarActive
    });
  };

  _onMobileSwitchSidebar = () => {
    const { responsive } = this.state;
    if ("single" === responsive) this._onSwitchSidebar();
  };

  renderRoutes() {
    return (
      <Switch>
        {dashRoutes.routes.map(route => (
          <Route
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        ))}
      </Switch>
    );
  }

  renderSidebar() {
    const { sidebarActive } = this.state;
    return sidebarActive ? (
      <Sidebar colorIndex="brand" fixed={true}>
        <Header size="large" pad={{ horizontal: "medium" }} justify="between">
          <img src={require("../../assets/images/logo-text.png")} height={72} />
          <Anchor
            icon={<CloseIcon />}
            plain={true}
            onClick={this._onSwitchSidebar}
          />
        </Header>
        <Menu fill={true} primary={true}>
          {dashRoutes.routes.map(
            route =>
              route.navable ? (
                <Anchor
                  path={{ path: route.path, index: true }}
                  label={route.name}
                  icon={route.icon ? <route.icon size="small" /> : null}
                  onClick={this._onMobileSwitchSidebar}
                />
              ) : null
          )}
        </Menu>
      </Sidebar>
    ) : null;
  }

  renderHeader() {
    const routeFound = dashRoutes.routes.find(
      route => route.path === router.location.pathname
    );

    console.log(routeFound);

    if (
      routeFound === undefined ||
      routeFound.navable === false ||
      routeFound.withoutHeader
    )
      return null;

    const title = routeFound.name;

    const { sidebarActive } = this.state;
    return (
      <Header size="large" justify="between">
        <Box direction="row" responsive={false}>
          <Box pad={{ horizontal: "medium" }}>
            {!sidebarActive ? (
              <Anchor
                icon={<MenuIcon />}
                plain={true}
                onClick={this._onSwitchSidebar}
              />
            ) : null}
          </Box>
          <Title>{title}</Title>
        </Box>

        {!this.editing ? (
          <Box
            pad={{ horizontal: "medium" }}
            direction="row"
            align="center"
            responsive={false}
          >
            {userStore.role === "ROLE_MODERATOR" ? (
              <Anchor
                icon={<AddIcon />}
                plain={true}
                onClick={this._onSwitchEditor}
              />
            ) : null}
            {userStore.role === "ROLE_PARTICIPANT" ? (
              <React.Fragment>
                <Value
                  value={partStore.stars}
                  size="small"
                  trendIcon={<StarIcon colorIndex="neutral-1" />}
                />
              </React.Fragment>
            ) : null}
            <Menu
              responsive={true}
              icon={<UserIcon />}
              dropAlign={{ right: "right" }}
            >
              <Box direction="row" responsive={false} justify="between">
                <s />
                <Button
                  plain
                  align="end"
                  icon={<UserIcon />}
                  onClick={() => {}}
                />
              </Box>
              <Box pad={{ horizontal: "medium" }}>
                <Heading tag="h4" strong align="center">
                  {userStore.user.name}
                </Heading>
              </Box>
              <Anchor onClick={userStore.logout}>
                <Heading margin="none" tag="h4" strong align="center">
                  Logout
                </Heading>
              </Anchor>
            </Menu>
          </Box>
        ) : null}
      </Header>
    );
  }

  renderEditorRoutes() {
    if (this.editing) {
      return (
        <Animate
          enter={{ animation: "slide-left", duration: 300 }}
          leave={{ animation: "slide-right", duration: 300 }}
        >
          <Layer
            align="right"
            closer={true}
            flush={false}
            onClose={this._onSwitchEditor}
          >
            <Box justify="start" full="vertical" pad={{ vertical: "large" }}>
              <Switch>
                {dashRoutes.routes.map(route => (
                  <Route
                    path={route.path}
                    component={route.addComponent}
                    exact={route.exact}
                  />
                ))}
              </Switch>
            </Box>
          </Layer>
        </Animate>
      );
    }
  }

  render() {
    const { responsive, sidebarActive } = this.state;
    const priority =
      sidebarActive && "single" === responsive ? "left" : "right";
    if (userStore.isLoggedIn) {
      if (this.didLoadEverything)
        return (
          <Split
            flex="right"
            priority={priority}
            onResponsive={this._onResponsive}
          >
            {this.renderSidebar()}
            <ExpandableBox>
              {this.renderHeader()}
              {this.renderRoutes()}

              {this.renderEditorRoutes()}
            </ExpandableBox>
          </Split>
        );
      else {
        this.fetchEverything();
        return (
          <Box
            full="vertical"
            align="center"
            justify="center"
            colorIndex="light-2"
          >
            <Headline align="center" size="small">
              Please wait...
            </Headline>
            <Headline align="center" size="small" strong>
              Loading Data
            </Headline>
            <Spinner size="large" />
          </Box>
        );
      }
    }
    return (
      <Box full colorIndex="accent-2" align="center" justify="center">
        <Heading strong>YOUR ARE NOT ALLOWED TO BE HERE</Heading>
      </Box>
    );
  }
}

const ExpandableBox = styled(Box)`
  min-height: 100vh;
`;
