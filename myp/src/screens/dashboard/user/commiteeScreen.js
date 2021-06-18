import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
// import Notification from "grommet/components/Notification";
import Heading from "grommet/components/Heading";
import MembersIcon from "grommet/components/icons/base/Group";
import Title from "grommet/components/Title";
import { observer } from "mobx-react";
import React from "react";
import FetchingLoader from "../../../components/FetchingLoader";
import { ParticipantDocuments } from "../../../components/MainActions";
import SearchComponent from "../../../components/SearchComponent";
import { EndorsementTiles } from "../../../components/UserTiles";
import asSubscreen from "../../../hoc/asSubscreen";
import participantStore from "../../../stores/participants/participantStore";
import participantsStore from "../../../stores/participants/participantsStore";
import Notification from "grommet/components/Notification";

@asSubscreen(participantStore)
@observer
export default class CommiteeScreen extends React.Component {
  componentDidMount() {
    // if (!participantStore.commitee.didFetch) participantStore.commitee.fetch();
  }
  renderHeader() {
    return (
      <Header separator="top" size="large" justify="between">
        <Box
          direction="row"
          responsive={false}
          align="center"
          pad={{ horizontal: "medium" }}
        >
          <Heading tag="h2" margin="none" strong>
            {participantStore.commitee.name}
          </Heading>
        </Box>
      </Header>
    );
  }

  render() {
    if (participantStore.commitee)
      return (
        <Box>
          {this.renderHeader()}
          <SearchComponent
            store={participantStore.commitee}
            contentName="Members"
          />
          {/* <Actions dataType={DataTypes.party} dataId={this.id} /> */}
          <ParticipantDocuments
            documents={participantStore.commitee.documents}
          />
          <Box separator="bottom" pad={{ vertical: "medium" }}>
            <Box
              direction="row"
              pad={{ horizontal: "medium", between: "small" }}
              responsive={false}
            >
              <MembersIcon colorIndex="accent-2" />
              <Title>Members</Title>
            </Box>
            <EndorsementTiles
              users={participantStore.commitee.filteredMembers}
              ignoreClick
              dontStretch
            />
            <FetchingLoader store={participantsStore} />
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
