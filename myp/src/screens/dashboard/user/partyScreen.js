import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import MembersIcon from "grommet/components/icons/base/Group";
import Image from "grommet/components/Image";
import Title from "grommet/components/Title";
import { observer } from "mobx-react";
import React from "react";
import { parseMedia } from "../../../api";
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
export default class PartyScreen extends React.Component {
  componentDidMount() {
    // if (!participantStore.party.didFetch) participantStore.party.fetch();
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
              participantStore.party.image
                ? parseMedia(participantStore.party.image.contentUrl)
                : ""
            }
            size="thumb"
          />
          <Heading tag="h2" margin="none" strong>
            {participantStore.party.name}
          </Heading>
        </Box>
      </Header>
    );
  }

  render() {
    if (participantStore.party)
      return (
        <Box>
          {this.renderHeader()}
          <SearchComponent
            store={participantStore.party}
            contentName="Members"
          />
          <ParticipantDocuments documents={participantStore.party.documents} />
          <Box separator="bottom" pad={{ vertical: "medium" }}>
            <Box
              direction="row"
              pad={{ horizontal: "medium", between: "small" }}
              responsive={false}
            >
              <MembersIcon colorIndex="accent-2" />
              <Title>Members</Title>
            </Box>
            <EndorsementTiles users={participantStore.party.filteredMembers} />
            <FetchingLoader store={participantsStore} />
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
