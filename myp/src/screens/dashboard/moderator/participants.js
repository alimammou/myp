import Box from "grommet/components/Box";
import UserIcon from "grommet/components/icons/base/User";
import Title from "grommet/components/Title";
import { observer } from "mobx-react";
import React from "react";
import FetchingLoader from "../../../components/FetchingLoader";
import SearchComponent from "../../../components/SearchComponent";
import UserTiles, { ParticipantsTiles } from "../../../components/UserTiles";
import participantsStore from "../../../stores/moderator/participants";
import Actions, { DataTypes } from "../../../components/MainActions";

@observer
export default class ParticipantsScreen extends React.Component {
  componentDidMount() {
    if (!participantsStore.didFetch) {
      participantsStore.fetch();
    }
  }

  render() {
    return (
      <Box flex>
        <SearchComponent store={participantsStore} contentName="Participants" />
        <Actions isGeneric={true} dataType={DataTypes.generic} withExport />
        <Box separator="bottom" pad={{ vertical: "medium" }} flex>
          <Title pad={{ horizontal: "medium" }}>Members</Title>
          <UserTiles users={participantsStore.filteredData} isPart />
          {/* <ParticipantsTiles /> */}
          <FetchingLoader store={participantsStore} />
        </Box>
      </Box>
    );
  }
}
