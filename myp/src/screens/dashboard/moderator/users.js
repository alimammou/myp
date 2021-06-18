import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import FormField from "grommet/components/FormField";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import ApproveIcon from "grommet/components/icons/base/Checkmark";
import ManageIcon from "grommet/components/icons/base/Layer";
import DeleteIcon from "grommet/components/icons/base/Trash";
import ClearIcon from "grommet/components/icons/base/Clear";
import ModeratorIcon from "grommet/components/icons/base/UserManager";
import CoachIcon from "grommet/components/icons/base/UserWorker";
import Select from "grommet/components/Select";
import Tile from "grommet/components/Tile";
import Tiles from "grommet/components/Tiles";
import Title from "grommet/components/Title";
import Split from "grommet/components/Split";
import Label from "grommet/components/Label";
import Toast from "grommet/components/Toast";
import Status from "grommet/components/icons/Status";
import UserIcon from "grommet/components/icons/base/User";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import FetchingLoader from "../../../components/FetchingLoader";
import LoadingOverlay from "../../../components/LoadingOverlay";
import SearchComponent from "../../../components/SearchComponent";
import usersStore, { roles } from "../../../stores/moderator/users";
import styled from "styled-components";
import appStore from "../../../stores/app";
import Anchor from "grommet/components/Anchor";
import BackIcon from "grommet/components/icons/base/LinkPrevious";
import RejectIcon from "grommet/components/icons/base/Close";
import Sidebar from "grommet/components/Sidebar";
import Animate from "grommet/components/Animate";
import Menu from "grommet/components/Menu";
import PartyIcon from "grommet/components/icons/base/Group";
import CommityIcon from "grommet/components/icons/base/Cluster";
import Image from "grommet/components/Image";
import partiesStore from "../../../stores/moderator/parties";
import commiteesStore from "../../../stores/moderator/commitees";

@observer
export default class Users extends React.Component {
  componentDidMount() {
    if (!usersStore.didFetch) {
      usersStore.fetch();
    }
  }

  @observable
  sidebarActive = false;

  @observable
  target;

  switchSidebar = () => {
    this.sidebarActive = !this.sidebarActive;
  };

  _onSwitchForm = () => {
    this.additionFormOpen = !this.additionFormOpen;
  };

  _switchTarget = target => () => {
    console.log(target);
    this.target = target;
    this.switchSidebar();
  };

  render() {
    console.log(this.target);
    return (
      <Split flex="left" priority={this.sidebarActive ? "right" : "left"}>
        <Box>
          <SearchComponent store={usersStore} contentName="Users" />
          <UsersForm />
          <UserTiles onManage={this._switchTarget} />
          <FetchingLoader store={usersStore} />
        </Box>
        {this.sidebarActive ? (
          <UserSidebar user={this.target} switchSidebar={this.switchSidebar} />
        ) : null}
      </Split>
    );
  }
}

const UserTiles = observer(({ onManage }) => (
  <Tiles selectable={true} flush={false} fill={false} size="large">
    {usersStore.filteredData.map(user => (
      <UserTile key={user.id} user={user} onManage={onManage} />
    ))}
  </Tiles>
));

@observer
class UsersForm extends React.Component {
  @observable
  selectedValue;
  @observable
  name;
  @observable
  email;
  @observable
  password;

  _onSubmit = e => {
    e.preventDefault();
    usersStore.post(
      {
        name: this.name,
        password: this.password,
        email: this.email,
        role: this.selectedValue.value
      },
      this._clearForm()
    );
  };

  _clearForm = () => {
    this.name = "";
    this.password = "";
    this.email = "";
    this.selectedValue = null;
  };

  componentDidMount() {
    this._clearForm();
  }
  render() {
    return (
      <Box
        separator="bottom"
        pad={{ horizontal: "medium", between: "medium", vertical: "medium" }}
        style={{ position: "relative" }}
      >
        <Title>Add new user</Title>
        <Form onSubmit={this._onSubmit} plain>
          <FormBox pad={{ between: "medium" }}>
            <Box direction="row" pad={{ between: "medium" }}>
              <FormField>
                <input
                  required
                  placeholder="Moderator or Mentor Name"
                  type="text"
                  value={this.name}
                  onChange={c => (this.name = c.target.value)}
                />
              </FormField>
              <FormField>
                <input
                  required
                  placeholder="Moderator or Mentor Email"
                  type="email"
                  value={this.email}
                  onChange={c => (this.email = c.target.value)}
                />
              </FormField>
            </Box>
            <Box direction="row" pad={{ between: "medium" }}>
              <FormField>
                <input
                  required
                  placeholder="Password"
                  type="password"
                  value={this.password}
                  onChange={c => (this.password = c.target.value)}
                />
              </FormField>
              <FormField>
                <Select
                  value={this.selectedValue}
                  placeHolder="Role"
                  options={[
                    { value: "ROLE_MODERATOR", label: "Moderator" },
                    { value: "ROLE_COACH", label: "Mentor" }
                  ]}
                  ref={c => (this.comp = c)}
                  onChange={({ option }) => {
                    this.selectedValue = option;
                  }}
                />
              </FormField>
            </Box>
            <Box>
              <Button type="submit" label="Add User" />
            </Box>
          </FormBox>
        </Form>
        <LoadingOverlay
          loading={usersStore.isPosting}
          message="Adding user, please wait..."
        />
      </Box>
    );
  }
}

const UserTile = observer(({ user, onManage }) => {
  let toast = (
    <Toast
      status="critical"
      onClose={() => {
        user.askDelete = false;
      }}
    >
      <Box direction="row" justify="between" align="center" responsive={false}>
        <span>
          Are you sure you want to delete party <strong>{user.name}</strong>?
        </span>
        <Button icon={<ApproveIcon />} onClick={user.delete} />
      </Box>
    </Toast>
  );

  return (
    <Tile
      style={{ position: "relative" }}
      colorIndex="light-2"
      align="start"
      direction="row"
      responsive={false}
    >
      <Box
        flex
        pad={{ horizontal: "medium", between: "medium", vertical: "medium" }}
      >
        <Box pad={{ between: "medium" }} flex>
          <Box direction="row" pad={{ between: "small" }} responsive={false}>
            {user.role === "ROLE_COACH" ? <CoachIcon /> : <ModeratorIcon />}
            <Box>
              <Heading tag="h4" strong style={{ margin: 0 }}>
                {user.name}
              </Heading>
              <Heading tag="h5">{roles[user.role]}</Heading>
            </Box>
          </Box>
          <Box>
            {user.party ? (
              <Label strong size="small">
                {` Party: ${user.party.name}`}
              </Label>
            ) : null}
            {user.commity ? (
              <Label strong size="small">
                {`Commitee: ${user.commity.name}`}
              </Label>
            ) : null}
          </Box>
        </Box>
      </Box>
      <Box justify="start" alignSelf="stretch" pad="small">
        {user.role === "ROLE_COACH" ? (
          <Button
            label="Manage"
            icon={<ManageIcon />}
            plain
            onClick={onManage(user)}
          />
        ) : null}
        <Button
          label="Delete"
          icon={<DeleteIcon />}
          plain
          onClick={() => {
            user.askDelete = true;
          }}
        />
      </Box>
      <LoadingOverlay loading={user.isSyncing} />
      {user.askDelete ? toast : null}
    </Tile>
  );
});

@observer
export class AdminAdditor extends React.Component {
  _onSubmit = e => {
    const { user } = this.props;
    e.preventDefault();
    if (user) user.update({ name: this._partyName });
    else
      usersStore.post({
        name: this._partyName
      });
  };

  render() {
    const { user } = this.props;
    return (
      <Form ref={c => (this._form = c)} onSubmit={this._onSubmit}>
        <Header>
          <Heading>{user ? `Editing ${user.name}` : "New User"}</Heading>
        </Header>
        <FormField label="Name">
          <input
            type="text"
            required
            defaultValue={user ? user.name : ""}
            name="name"
            onChange={e => (this._partyName = e.target.value)}
          />
        </FormField>
        <Box direction="row" pad={{ vertical: "medium", between: "medium" }}>
          <Button label={user ? "Update" : "Add"} primary type="submit" />
        </Box>
        <LoadingOverlay
          loading={user ? user.isSyncing : usersStore.isPosting}
        />
      </Form>
    );
  }
}

const FormBox = styled(Box)`
  @media screen and (min-width: 1400px) {
    ${"" /* flex-direction: row !important;
    align-items: center !important;
    height: 49px; */} ${props => {
      props.direction = "row";
    }};
  }
`;

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
    this.user = props.user;
  }

  _switchSelecter = type => () => {
    this.selecterType = type;
  };

  renderSideBarHeader() {
    if (this.selecterType) {
      return (
        <Header
          separator="top"
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
    const { name } = this.user;
    return (
      <Header
        separator="top"
        justify="start"
        size={appStore.isMobile ? "large" : "small"}
        pad={appStore.isMobile ? "large" : "small"}
      >
        <Anchor icon={<RejectIcon />} onClick={this.props.switchSidebar} />
        <Heading tag="h3">{name}</Heading>
      </Header>
    );
  }

  render() {
    if (this.selecterType) {
      return (
        <Animate enter={{ animation: "slide-left", duration: 300 }}>
          <Sidebar separator="left" colorIndex="accent-2">
            {this.renderSideBarHeader()}
            <MenuTiles selector={this.selecterType} app={this.user} />
          </Sidebar>
        </Animate>
      );
    } else
      return (
        <Animate enter={{ animation: "slide-left", duration: 300 }}>
          <Sidebar separator="left" colorIndex="accent-2">
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
            </Menu>
          </Sidebar>
        </Animate>
      );
  }
}

const assigntoparty = (d, p) => () => {
  d.assignToParty(p);
};

const assigntocommittee = (d, p) => () => {
  d.assignToCommittee(p);
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
              app
                ? (selector === "Party" &&
                    app.party &&
                    app.party.id === d.id) ||
                  (selector !== "Party" &&
                    app.commity &&
                    app.commity.id === d.id)
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

        <Anchor
          icon={selector === "Party" ? <ClearIcon /> : <ClearIcon />}
          label="None"
          onClick={
            selector === "Party"
              ? assigntoparty(app, null)
              : assigntocommittee(app, null)
          }
        />
      </Menu>
    </React.Fragment>
  );
});
