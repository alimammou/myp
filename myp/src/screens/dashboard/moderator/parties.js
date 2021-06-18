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
import Image from "grommet/components/Image";
import Layer from "grommet/components/Layer";
import Tile from "grommet/components/Tile";
import Tiles from "grommet/components/Tiles";
import Toast from "grommet/components/Toast";
import Value from "grommet/components/Value";
import { observer } from "mobx-react";
import React from "react";
import { parseMedia } from "../../../api";
import LoadingOverlay from "../../../components/LoadingOverlay";
import SearchComponent from "../../../components/SearchComponent";
import partyStore from "../../../stores/moderator/parties";
import router from "../../../stores/router";

@observer
export default class PartyScreen extends React.Component {
  componentDidMount() {
    if (!partyStore.didFetch) {
      partyStore.fetch("PartyScreen");
    }
  }

  _onSwitchForm = () => {
    this.additionFormOpen = !this.additionFormOpen;
  };

  render() {
    return (
      <Box>
        <SearchComponent store={partyStore} contentName="Parties" />
        <PartyTiles />
        <FetchingLoader />
      </Box>
    );
  }
}

const navToParty = id => () => {
  router.push(`/dashboard/party/${id}`);
};

const PartyTiles = observer(() => (
  <Tiles selectable={true} flush={false} fill={true} size="large">
    {partyStore.filteredData.map(party => (
      <PartyTile key={party.id} party={party} />
    ))}
  </Tiles>
));

const PartyTile = observer(({ party }) => {
  let toast = (
    <Toast
      status="critical"
      onClose={() => {
        party.askDelete = false;
      }}
    >
      <Box direction="row" justify="between" align="center" responsive={false}>
        <span>
          Are you sure you want to delete party <strong>{party.name}</strong>?
        </span>
        <Button icon={<ApproveIcon />} onClick={party.delete} />
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
          <Image
            src={party.image ? parseMedia(party.image.contentUrl) : ""}
            size="thumb"
          />
          <Heading tag="h3" strong>
            {party.name}
          </Heading>
        </Box>
        <Box align="start">
          <Value size="small" value={party.membersCount} units="Members" />
        </Box>
      </Box>
      <Box justify="between" alignSelf="stretch" pad="small">
        <Button
          label="Edit"
          icon={<EditIcon />}
          plain
          onClick={() => {
            party.isEditing = true;
          }}
        />
        <Button
          label="Manage"
          icon={<ManageIcon />}
          plain
          path={`/dashboard/party/${party.id}`}
          // onClick={navToParty(party.id)}
        />
        <Button
          label="Delete"
          icon={<DeleteIcon />}
          plain
          onClick={() => {
            party.askDelete = true;
          }}
        />
      </Box>
      <LoadingOverlay loading={party.isSyncing} />
      {party.askDelete ? toast : null}
      {party.isEditing ? (
        <Layer
          align="right"
          closer={true}
          flush={false}
          onClose={() => {
            party.isEditing = false;
          }}
        >
          <Box justify="start" full="vertical" pad={{ vertical: "large" }}>
            <PartyAdditor party={party} />
          </Box>
        </Layer>
      ) : null}
    </Tile>
  );
});

@observer
export class PartyAdditor extends React.Component {
  _onSubmit = e => {
    const { party } = this.props;
    e.preventDefault();
    if (party)
      party.update({ name: this._partyName, image: this._fileToUpload });
    else
      partyStore.post({
        name: this._partyName,
        image: this._fileToUpload
      });
  };

  render() {
    const { party } = this.props;
    return (
      <Form ref={c => (this._form = c)} onSubmit={this._onSubmit}>
        <Header>
          <Heading>{party ? `Editing ${party.name}` : "New Party"}</Heading>
        </Header>
        <FormField label="Name">
          <input
            type="text"
            required
            defaultValue={party ? party.name : ""}
            name="name"
            onChange={e => (this._partyName = e.target.value)}
          />
        </FormField>
        <FormField label="Image">
          <input
            type="file"
            name="file"
            onChange={e => (this._fileToUpload = e.target.files[0])}
          />
        </FormField>
        <Box direction="row" pad={{ vertical: "medium", between: "medium" }}>
          <Button label={party ? "Update" : "Add"} primary type="submit" />
        </Box>
        <LoadingOverlay
          loading={party ? party.isSyncing : partyStore.isPosting}
        />
      </Form>
    );
  }
}

const FetchingLoader = observer(() => {
  return partyStore.isFetching ? (
    <Box flex pad="medium" align="center" justify="center">
      <Spinner size="large" />
    </Box>
  ) : null;
});
