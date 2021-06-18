import Anchor from "grommet/components/Anchor";
import Animate from "grommet/components/Animate";
import Box from "grommet/components/Box";
import Toast from "grommet/components/Toast";
import Header from "grommet/components/Header";
import Button from "grommet/components/Button";
import Heading from "grommet/components/Heading";
import AcceptIcon from "grommet/components/icons/base/Checkmark";
import RejectIcon from "grommet/components/icons/base/Close";
import CommityIcon from "grommet/components/icons/base/Cluster";
import PartyIcon from "grommet/components/icons/base/Group";
import BackIcon from "grommet/components/icons/base/LinkPrevious";
import MailIcon from "grommet/components/icons/base/Mail";
import MoreIcon from "grommet/components/icons/base/More";
import TrashIcon from "grommet/components/icons/base/Trash";
import Image from "grommet/components/Image";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Menu from "grommet/components/Menu";
import Notification from "grommet/components/Notification";
import Sidebar from "grommet/components/Sidebar";
import Split from "grommet/components/Split";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import FetchingLoader from "../../../components/FetchingLoader";
import asSubscreen from "../../../hoc/asSubscreen";
import appStore from "../../../stores/app";
import applicationStore from "../../../stores/moderator/applications";
import commiteesStore from "../../../stores/moderator/commitees";
import partiesStore from "../../../stores/moderator/parties";
import router from "../../../stores/router";
import userStore from "../../../stores/user";

@asSubscreen(applicationStore)
@observer
export default class ApplicationScreen extends React.Component {
  @computed
  get application() {
    return applicationStore.getApplication(this.props.match.params.appIndex);
  }

  @observable
  sidebarActive = false;

  switchSidebar = () => {
    this.sidebarActive = !this.sidebarActive;
  };

  renderToast() {
    return this.application.askDelete ? (
      <Toast
        status="critical"
        onClose={() => {
          this.application.askDelete = false;
        }}
      >
        <Box
          direction="row"
          justify="between"
          align="center"
          responsive={false}
        >
          <span>
            Are you sure you want to delete{" "}
            <strong>{this.application.name}'s</strong> application and
            associated user account?
          </span>
          <Button
            icon={<AcceptIcon />}
            onClick={this.application.delete(true)}
          />
        </Box>
      </Toast>
    ) : null;
  }

  renderHeader() {
    console.log(this.props);
    return (
      <Header colorIndex="light-2" size="large" justify="between">
        <Box
          direction="row"
          responsive={false}
          align="center"
          pad={{ horizontal: "small" }}
        >
          <Anchor icon={<BackIcon />} onClick={router.goBack} />
          <Heading tag="h2" margin="none" strong>
            {this.application.name}
          </Heading>
        </Box>
        {appStore.isMobile ? (
          <Box pad={{ horizontal: "small" }}>
            <Anchor icon={<MoreIcon />} onClick={this.switchSidebar} />
          </Box>
        ) : null}
      </Header>
    );
  }

  renderNotification() {
    const { status, name, isPasswordSet } = this.application;
    let message = "";
    let nStatus = "unknown";
    switch (status) {
      case "unknown": {
        message = "Application needs a review.";
        break;
      }
      case "accepted": {
        message = `${name}'s application have been accepted.`;
        nStatus = "ok";
        break;
      }
      case "rejected": {
        message = `${name}'s application have been rejected.`;
        nStatus = "critical";
        break;
      }
      default:
        break;
    }

    return (
      <React.Fragment>
        <Notification status={nStatus} message={message} />
        {isPasswordSet ? null : (
          <Notification
            status="critical"
            message={`${name} didn't set a password yet.`}
          />
        )}
      </React.Fragment>
    );
  }

  renderBody() {
    return (
      <Box pad={{ vertical: "large", between: "large" }}>
        <Box
          direction="row"
          pad={{ between: appStore.isMobile ? "large" : "none" }}
        >
          <Box flex>
            <Box pad={{ horizontal: "medium" }}>
              <Heading tag="h2">General Information</Heading>
            </Box>
            <List>
              <ApplicationListItem
                identifier="Name"
                value={this.application.name}
                first
              />
              {/* <ApplicationListItem
                identifier="Email"
                value={this.application.email}
              /> */}
              <ApplicationListItem
                identifier="USJ Email"
                value={this.application.usjEmail}
              />
              <ApplicationListItem
                identifier="Phone Number"
                value={this.application.phone}
              />
              <ApplicationListItem
                identifier="Age"
                value={this.application.age}
              />
            </List>
          </Box>
          <Box flex>
            <Box pad={{ horizontal: "medium" }}>
              <Heading tag="h2">Educational Information</Heading>
            </Box>
            <List>
              <ApplicationListItem
                identifier="Faculty"
                value={this.application.faculty}
                first
              />
              <ApplicationListItem
                identifier="Major"
                value={this.application.major}
              />
              <ApplicationListItem
                identifier="Campus"
                value={this.application.campus}
              />
              <ApplicationListItem
                identifier="City"
                value={this.application.city}
              />
            </List>
          </Box>
        </Box>
        <Box>
          <Box pad={{ horizontal: "medium" }}>
            <Heading tag="h2">Questionaire Answers</Heading>
          </Box>
          <List>
            <QuestionaireListItem
              identifier="Do you need accommodation in Beirut? "
              value={this.application.accomodationNeeded}
              first
              parse
            />
            <QuestionaireListItem
              identifier="Did you participate in MYP before?  "
              value={this.application.didParticipate}
              parse
            />
            <QuestionaireListItem
              identifier="Did you participate in similar programs before? "
              value={
                this.application.similarParticipation
                  ? this.application.similarParticipationNames
                  : this.application.similarParticipation
              }
              parse={!this.application.similarParticipation}
            />
            <QuestionaireListItem
              identifier="How did you hear about the MYP? "
              value={this.application.hearingWay}
            />
            <QuestionaireListItem
              identifier="Give us your opinion about the role of the Lebanese Parliament in one sentence"
              value={this.application.opinion}
            />
          </List>
        </Box>
      </Box>
    );
  }

  render() {
    return (
      <Split flex="left" priority={this.sidebarActive ? "right" : "left"}>
        <Box>
          {this.renderHeader()}
          {this.renderNotification()}
          {this.renderBody()}
        </Box>
        {userStore.role === "ROLE_MODERATOR" ? (
          <React.Fragment>
            <UserSidebar
              application={this.application}
              switchSidebar={this.switchSidebar}
            />
            {this.renderToast()}
          </React.Fragment>
        ) : null}
      </Split>
    );
  }
}

const ApplicationListItem = ({ identifier, value, first }) => (
  <ListItem separator={first ? "horizontal" : "bottom"} pad="medium">
    <Box size="small">
      <Heading strong tag="h3" margin="none">
        {identifier}
      </Heading>
    </Box>
    <Heading tag="h3" margin="none">
      {value}
    </Heading>
  </ListItem>
);

const QuestionaireListItem = ({ identifier, value, parse, first }) => (
  <ListItem
    separator={first ? "horizontal" : "bottom"}
    pad="medium"
    align="start"
  >
    <Box size="medium">
      <Heading strong tag="h3" margin="none">
        {identifier}
      </Heading>
    </Box>
    <Heading tag="h3" margin="none">
      {parse ? (value ? "Yes" : "No") : value}
    </Heading>
  </ListItem>
);

@observer
class UserSidebar extends React.Component {
  @observable
  selecterType;

  selectoreTypes = {
    party: "Party",
    commity: "Committee"
  };

  constructor(props) {
    super(props);
    this.application = props.application;
  }

  _switchSelecter = type => () => {
    this.selecterType = type;
  };

  _askDelete = () => {
    this.application.askDelete = true;
  };

  renderSideBarHeader() {
    if (this.selecterType) {
      return (
        <Header
          justify="start"
          size={appStore.isMobile ? "large" : "medium"}
          pad={appStore.isMobile ? "large" : "small"}
          align="center"
        >
          <Anchor icon={<BackIcon />} onClick={this._switchSelecter()} />
          <Heading tag="h3" margin="none">
            Select {this.selecterType}
          </Heading>
        </Header>
      );
    }
    if (appStore.isMobile) {
      const { name } = this.application;
      return (
        <Header justify="between" size="large" pad="large">
          <Heading tag="h3">{name}</Heading>
          <Anchor icon={<RejectIcon />} onClick={this.props.switchSidebar} />
        </Header>
      );
    } else return <Header justify="between" size="large" pad="large" />;
  }

  render() {
    const { status } = this.application;
    if (this.selecterType) {
      return (
        <Animate enter={{ animation: "slide-left", duration: 300 }}>
          <Sidebar colorIndex="light-2">
            {this.renderSideBarHeader()}
            <MenuTiles selector={this.selecterType} app={this.application} />
          </Sidebar>
        </Animate>
      );
    } else if (status !== "accepted")
      return (
        <Animate enter={{ animation: "slide-left", duration: 300 }}>
          <Sidebar colorIndex="light-2">
            {this.renderSideBarHeader()}
            <Menu primary>
              <Anchor
                icon={<AcceptIcon />}
                label="Accept"
                onClick={this.application.accept}
              />
              <Anchor
                icon={<RejectIcon />}
                label="Reject"
                onClick={this.application.reject}
              />
              <Anchor
                icon={<TrashIcon />}
                label="Delete"
                onClick={this._askDelete}
              />
            </Menu>
          </Sidebar>
        </Animate>
      );
    else
      return (
        <Animate enter={{ animation: "slide-left", duration: 300 }}>
          <Sidebar colorIndex="light-2">
            {this.renderSideBarHeader()}
            <Menu primary>
              <Anchor
                icon={<PartyIcon />}
                label="Assign to Party"
                onClick={this._switchSelecter(this.selectoreTypes.party)}
              />
              <Anchor
                icon={<CommityIcon />}
                label="Assign to Commity"
                onClick={this._switchSelecter(this.selectoreTypes.commity)}
              />
              <Anchor
                icon={<TrashIcon />}
                label="Delete"
                onClick={this._askDelete}
              />
              <Anchor
                icon={<MailIcon />}
                label="Resend Password Email"
                onClick={this.application.resendPasswordReminder}
              />
            </Menu>
          </Sidebar>
        </Animate>
      );
  }
}

const assigntoparty = (d, p) => () => {
  d.assignToParty(p.id);
};

const assigntocommittee = (d, p) => () => {
  d.assignToCommittee(p.id);
};

const MenuTiles = observer(({ selector, app }) => {
  const store = selector === "Party" ? partiesStore : commiteesStore;
  if (!store.didFetch) {
    store.fetch();
  }
  return (
    <React.Fragment>
      <Menu primary>
        <FetchingLoader store={store} partnerStore={app} overlayWhenPartner />
        {store.data.map(d => (
          <Anchor
            key={d.id}
            icon={
              selector === "Party" ? (
                <Image size="thumb" src={d.imageUrl} />
              ) : (
                <CommityIcon />
              )
            }
            label={` ${
              app.user
                ? (selector === "Party" &&
                    app.user.party &&
                    app.user.party.id === d.id) ||
                  (selector !== "Party" &&
                    app.user.commity &&
                    app.user.commity.id === d.id)
                  ? "(Current) "
                  : ""
                : ""
            }${d.name}`}
            onClick={
              selector === "Party"
                ? assigntoparty(app, d)
                : assigntocommittee(app, d)
            }
          />
        ))}
      </Menu>
    </React.Fragment>
  );
});
