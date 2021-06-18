import React from "react";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Tiles from "grommet/components/Tiles";
import Tile from "grommet/components/Tile";
import Title from "grommet/components/Title";
import Image from "grommet/components/Image";
import Layer from "grommet/components/Layer";
import Heading from "grommet/components/Heading";
import Select from "grommet/components/Select";
import Header from "grommet/components/Header";
import Form from "grommet/components/Form";
import FormField from "grommet/components/FormField";
import Toast from "grommet/components/Toast";
import SearchInput from "grommet/components/SearchInput";
import EditIcon from "grommet/components/icons/base/Edit";
import ManageIcon from "grommet/components/icons/base/Layer";
import DeleteIcon from "grommet/components/icons/base/Trash";
import ApproveIcon from "grommet/components/icons/base/Checkmark";
import Spinner from "grommet/components/icons/Spinning";
import usersStore, { roles } from "../../../stores/moderator/users";
import { observer } from "mobx-react";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { observable } from "mobx";
import SearchComponent from "../../../components/SearchComponent";

@observer
export default class Users extends React.Component {
  componentDidMount() {
    if (!usersStore.didFetch) {
      usersStore.fetch();
    }
  }

  _onSwitchForm = () => {
    this.additionFormOpen = !this.additionFormOpen;
  };

  render() {
    return (
      <Box>
        <SearchComponent store={usersStore} />
        <UsersForm />
        <UserTiles />
        <FetchingLoader />
      </Box>
    );
  }
}

const UserTiles = observer(() => (
  <Tiles selectable={true} flush={false} fill={false} size="large">
    {usersStore.filteredData.map(user => (
      <PartyTile key={user.id} user={user} />
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
          <Box direction="row" pad={{ between: "medium" }}>
            <FormField>
              <input
                required
                placeholder="Moderator or Coach Name"
                type="text"
                value={this.name}
                onChange={c => (this.name = c.target.value)}
              />
            </FormField>
            <FormField>
              <input
                required
                placeholder="Moderator or Coach Email"
                type="email"
                value={this.email}
                onChange={c => (this.email = c.target.value)}
              />
            </FormField>
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
                  { value: "ROLE_COACH", label: "Coach" }
                ]}
                ref={c => (this.comp = c)}
                onChange={({ option }) => {
                  this.selectedValue = option;
                }}
              />
            </FormField>
            <Button type="submit" label="Add User" />
          </Box>
        </Form>
        <LoadingOverlay
          loading={usersStore.isPosting}
          message="Adding user, please wait..."
        />
      </Box>
    );
  }
}

const PartyTile = observer(({ user }) => {
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
        <Box direction="row" pad={{ between: "medium" }} flex>
          <Heading tag="h3" strong>
            {user.name}
          </Heading>
        </Box>
        <Box align="start">
          <Heading tag="h4">{roles[user.role]}</Heading>
        </Box>
      </Box>
      <Box justify="start" alignSelf="stretch" pad="small">
        <Button label="Manage" icon={<ManageIcon />} plain onClick={() => {}} />
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

const FetchingLoader = observer(() => {
  return usersStore.isFetching ? (
    <Box flex pad="medium" align="center" justify="center">
      <Spinner size="large" />
    </Box>
  ) : null;
});
