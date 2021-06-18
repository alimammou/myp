import Box from "grommet/components/Box";
import MembersIcon from "grommet/components/icons/base/Group";
import Title from "grommet/components/Title";
import { observer } from "mobx-react";
import React from "react";
import FetchingLoader from "../../../components/FetchingLoader";
import SearchComponent from "../../../components/SearchComponent";
import { EndorsementTiles } from "../../../components/UserTiles";
import endorsementStore from "../../../stores/participants/participantsStore";

@observer
export default class ParticipantsScreen extends React.Component {
  componentDidMount() {
    if (!endorsementStore.didFetch) {
      endorsementStore.fetch();
    }
  }

  render() {
    return (
      <Box>
        <SearchComponent store={endorsementStore} contentName="Members" />
        <Box separator="bottom" pad={{ vertical: "medium" }}>
          <Box
            direction="row"
            pad={{ horizontal: "medium", between: "small" }}
            responsive={false}
          >
            <MembersIcon colorIndex="accent-2" />
            <Title>Members</Title>
          </Box>
          <EndorsementTiles users={endorsementStore.filteredData} />
          <FetchingLoader store={endorsementStore} />
        </Box>
      </Box>
    );
  }
}
