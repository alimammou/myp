import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
// import Notification from "grommet/components/Notification";
import Heading from "grommet/components/Heading";
import BackIcon from "grommet/components/icons/base/LinkPrevious";
import MoreIcon from "grommet/components/icons/base/More";
import Title from "grommet/components/Title";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import Actions, { DataTypes } from "../../../components/MainActions";
import SearchComponent from "../../../components/SearchComponent";
import UserTiles from "../../../components/UserTiles";
import asSubscreen from "../../../hoc/asSubscreen";
import appStore from "../../../stores/app";
import commityStore from "../../../stores/moderator/commitees";
import router from "../../../stores/router";

@observer
@asSubscreen(commityStore)
@observer
export default class CommiteeScreen extends React.Component {
  @computed
  get commity() {
    return commityStore.get(this.props.match.params.appIndex);
  }

  constructor(props) {
    super(props);
    this.id = Number(this.props.match.params.appIndex);
  }

  renderHeader() {
    return (
      <Header colorIndex="light-2" size="large" justify="between">
        <Box
          direction="row"
          responsive="false"
          align="center"
          pad={{ horizontal: "small" }}
        >
          <Anchor icon={<BackIcon />} onClick={router.goBack} />
          <Heading tag="h2" margin="none" strong>
            {this.commity.name}
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

  render() {
    return (
      <Box>
        {this.renderHeader()}
        <SearchComponent store={this.commity} contentName="Members" />
        <Actions dataType={DataTypes.commity} dataId={this.id} />
        <Box separator="bottom" pad={{ vertical: "medium" }}>
          <Title pad={{ horizontal: "medium" }}>Members</Title>
          <UserTiles users={this.commity.filteredMembers} />
        </Box>
      </Box>
    );
  }
}
