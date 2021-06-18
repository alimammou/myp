import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Form from "grommet/components/Form";
import FormField from "grommet/components/FormField";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import ApproveIcon from "grommet/components/icons/base/Checkmark";
import EditIcon from "grommet/components/icons/base/Edit";
import ManageIcon from "grommet/components/icons/base/Layer";
import DeleteIcon from "grommet/components/icons/base/Trash";
import Spinner from "grommet/components/icons/Spinning";
import Layer from "grommet/components/Layer";
import Tile from "grommet/components/Tile";
import Tiles from "grommet/components/Tiles";
import Toast from "grommet/components/Toast";
import Value from "grommet/components/Value";
import { observer } from "mobx-react";
import React from "react";
import LoadingOverlay from "../../../components/LoadingOverlay";
import SearchComponent from "../../../components/SearchComponent";
import commiteeStore from "../../../stores/moderator/commitees";

@observer
export default class Commitees extends React.Component {
  componentDidMount() {
    if (!commiteeStore.didFetch) {
      commiteeStore.fetch();
    }
  }

  _onSwitchForm = () => {
    this.additionFormOpen = !this.additionFormOpen;
  };

  render() {
    return (
      <Box>
        <SearchComponent store={commiteeStore} contentName="Committees" />
        <CommiteeTiles />
        <FetchingLoader />
      </Box>
    );
  }
}

const CommiteeTiles = observer(() => (
  <Tiles selectable={true} flush={false} fill={true} size="large">
    {commiteeStore.filteredData.map(commity => (
      <PartyTile key={commity.id} commity={commity} />
    ))}
  </Tiles>
));

const PartyTile = observer(({ commity }) => {
  let toast = (
    <Toast
      status="critical"
      onClose={() => {
        commity.askDelete = false;
      }}
    >
      <Box direction="row" justify="between" align="center" responsive={false}>
        <span>
          Are you sure you want to delete party <strong>{commity.name}</strong>?
        </span>
        <Button icon={<ApproveIcon />} onClick={commity.delete} />
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
            {commity.name}
          </Heading>
        </Box>
        <Box align="start">
          <Value size="small" value={commity.membersCount} units="Members" />
        </Box>
      </Box>
      <Box justify="between" alignSelf="stretch" pad="small">
        <Button
          label="Edit"
          icon={<EditIcon />}
          plain
          onClick={() => {
            commity.isEditing = true;
          }}
        />
        <Button
          label="Manage"
          icon={<ManageIcon />}
          plain
          path={`/dashboard/commitee/${commity.id}`}
        />
        <Button
          label="Delete"
          icon={<DeleteIcon />}
          plain
          onClick={() => {
            commity.askDelete = true;
          }}
        />
      </Box>
      <LoadingOverlay loading={commity.isSyncing} />
      {commity.askDelete ? toast : null}
      {commity.isEditing ? (
        <Layer
          align="right"
          closer={true}
          flush={false}
          onClose={() => {
            commity.isEditing = false;
          }}
        >
          <Box justify="start" full="vertical" pad={{ vertical: "large" }}>
            <CommityAdditor commity={commity} />
          </Box>
        </Layer>
      ) : null}
    </Tile>
  );
});

@observer
export class CommityAdditor extends React.Component {
  _onSubmit = e => {
    const { commity } = this.props;
    e.preventDefault();
    if (commity) commity.update({ name: this._partyName });
    else
      commiteeStore.post({
        name: this._partyName
      });
  };

  render() {
    const { commity } = this.props;
    return (
      <Form ref={c => (this._form = c)} onSubmit={this._onSubmit}>
        <Header>
          <Heading>{commity ? `Editing ${commity.name}` : "New Party"}</Heading>
        </Header>
        <FormField label="Name">
          <input
            type="text"
            required
            defaultValue={commity ? commity.name : ""}
            name="name"
            onChange={e => (this._partyName = e.target.value)}
          />
        </FormField>
        <Box direction="row" pad={{ vertical: "medium", between: "medium" }}>
          <Button label={commity ? "Update" : "Add"} primary type="submit" />
        </Box>
        <LoadingOverlay
          loading={commity ? commity.isSyncing : commiteeStore.isPosting}
        />
      </Form>
    );
  }
}

const FetchingLoader = observer(() => {
  return commiteeStore.isFetching ? (
    <Box flex pad="medium" align="center" justify="center">
      <Spinner size="large" />
    </Box>
  ) : null;
});
