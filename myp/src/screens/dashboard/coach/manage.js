import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
// import Notification from "grommet/components/Notification";
import Heading from "grommet/components/Heading";
import Image from "grommet/components/Image";
import Title from "grommet/components/Title";
import Notification from "grommet/components/Notification";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { parseMedia } from "../../../api";
import Actions, { DataTypes } from "../../../components/MainActions";
import SearchComponent from "../../../components/SearchComponent";
import UserTiles from "../../../components/UserTiles";
import asSubscreen from "../../../hoc/asSubscreen";
import coachStore from "../../../stores/coach/coach";
import CommiteesIcon from "grommet/components/icons/base/Cluster";

@observer
@asSubscreen(coachStore)
@observer
export default class PartyScreen extends React.Component {
  @computed
  get party() {
    return coachStore.party;
  }

  @computed
  get id() {
    return this.party.id;
  }

  renderHeader() {
    return (
      <Header separator="top" size="large" justify="between">
        <Box
          direction="row"
          responsive={false}
          align="center"
          pad={{ horizontal: "medium", between: "medium" }}
        >
          <Image
            src={
              this.party.image ? parseMedia(this.party.image.contentUrl) : ""
            }
            size="thumb"
          />
          <Heading tag="h2" margin="none" strong>
            {this.party.name}
          </Heading>
        </Box>
      </Header>
    );
  }

  render() {
    if (this.party)
      return (
        <Box>
          {this.renderHeader()}
          <SearchComponent store={this.party} contentName="Members" />
          <Actions dataType={DataTypes.party} dataId={this.id} />
          <Box separator="bottom" pad={{ vertical: "medium" }}>
            <Title pad={{ horizontal: "medium" }}>Members</Title>
            <UserTiles users={this.party.filteredMembers} />
          </Box>
        </Box>
      );
    return (
      <Box>
        <Notification
          state="Not Assigned to Party"
          message="You are not assigned to a party yet, be patient and try again later."
          status="warning"
        />
      </Box>
    );
  }
}

@observer
@asSubscreen(coachStore)
@observer
export class CommiteeScreen extends React.Component {
  @computed
  get commitee() {
    return coachStore.commitee;
  }

  @computed
  get id() {
    return this.commitee.id;
  }

  renderHeader() {
    return (
      <Header separator="top" size="large" justify="between">
        <Box
          direction="row"
          responsive={false}
          align="center"
          pad={{ horizontal: "medium", between: "medium" }}
        >
        <CommiteesIcon size="large" />
          <Heading tag="h2" margin="none" strong>
            {this.commitee.name}
          </Heading>
        </Box>
      </Header>
    );
  }

  render() {
    if (this.commitee)
      return (
        <Box>
          {this.renderHeader()}
          <SearchComponent store={this.commitee} contentName="Members" />
          <Actions dataType={DataTypes.commity} dataId={this.id} />
          <Box separator="bottom" pad={{ vertical: "medium" }}>
            <Title pad={{ horizontal: "medium" }}>Members</Title>
            <UserTiles users={this.commitee.filteredMembers} />
          </Box>
        </Box>
      );
    return (
      <Box>
        <Notification
          state="Not Assigned to Committee"
          message="You are not assigned to a committee yet, be patient and try again later."
          status="warning"
        />
      </Box>
    );
  }
}
