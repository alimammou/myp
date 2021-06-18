import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Headline from "grommet/components/Headline";
import Status from "grommet/components/icons/Status";
import UserIcon from "grommet/components/icons/base/User";
import Image from "grommet/components/Image";
import Tile from "grommet/components/Tile";
import Value from "grommet/components/Value";
import { observer } from "mobx-react";
import React from "react";
import { parseMedia } from "../../../api";
import { ParticipantDocuments } from "../../../components/MainActions";
import asSubscreen from "../../../hoc/asSubscreen";
import participantStore from "../../../stores/participants/participantStore";
import router from "../../../stores/router";
import userStore from "../../../stores/user";

@asSubscreen(participantStore)
@observer
export default class ProfileScreen extends React.Component {
  componentDidMount() {
    if (userStore.user && !participantStore.didFetch) {
      participantStore.fetch();
    }
  }

  render() {
    return (
      <Box separator="top">
        <Box align="center" pad={{horizontal:"medium",vertical:"medium",between:"small"}} direction="row" responsive={false}>          
        <UserIcon colorIndex="grey-4"/>
          <Headline size="small" strong margin="none">
            {userStore.user.name}
          </Headline>
        </Box>
        <Box direction="row" separator="bottom">
          <Box flex pad="medium">
            <Heading tag="h4" strong>
              About
            </Heading>
            <Heading tag="h3">{participantStore.profile.campus}</Heading>
            <Heading tag="h3">{participantStore.profile.faculty}</Heading>
            <Heading tag="h3">{participantStore.profile.major}</Heading>
          </Box>
          <Box flex pad="medium">
            <Heading tag="h4" strong>
              Member Of
            </Heading>
            <PartyTile />
            <CommiteeTile />
          </Box>
        </Box>
        <ParticipantDocuments documents={participantStore.allDocuments} />
      </Box>
    );
  }
}

const PartyTile = observer(
  () =>
    participantStore.party ? (
      <Tile
        style={{ position: "relative" }}
        colorIndex="neutral-3"
        align="start"
        margin={{ bottom: "small" }}
        direction="row"
        responsive={false}
        onClick={() => {
          router.push(`/dashboard/party`);
        }}
      >
        <Box
          flex
          pad={{
            horizontal: "small",
            between: "small",
            vertical: "small"
          }}
        >
          <Box
            direction="row"
            pad={{ between: "medium" }}
            responsive={false}
            flex
          >
            <Box
              flex
              direction="row"
              pad={{ between: "medium" }}
              responsive={false}
              style={{ overflow: "hidden" }}
            >
              <Image
                src={
                  participantStore.party.image
                    ? parseMedia(participantStore.party.image.contentUrl)
                    : ""
                }
                size="thumb"
              />
              <Heading tag="h3" strong>
                {participantStore.party.name}
              </Heading>
            </Box>
            <Value
              size="small"
              value={participantStore.party.membersCount}
              units="Members"
            />
          </Box>
        </Box>
      </Tile>
    ) : (
      <Tile
        colorIndex="light-2"
        align="start"
        margin={{ bottom: "small" }}
        pad={{ horizontal: "medium", vertical: "small" }}
        direction="row"
        responsive={false}
        onClick={() => {}}
      >
        <Heading tag="h3" strong>
          <Status value="warning" />
          You haven't been assigned to a party yet
        </Heading>
      </Tile>
    )
);

const CommiteeTile = observer(
  () =>
    participantStore.commitee ? (
      <Tile
        style={{ position: "relative" }}
        colorIndex="neutral-3"
        align="start"
        margin={{ bottom: "small" }}
        direction="row"
        responsive={false}
        onClick={() => {
          router.push(`/dashboard/commitee`);
        }}
      >
        <Box
          flex
          pad={{
            horizontal: "small",
            between: "small",
            vertical: "small"
          }}
          responsive={false}
        >
          <Box
            direction="row"
            pad={{ between: "medium" }}
            responsive={false}
            flex
          >
            <Box flex>
              <Heading tag="h3" strong>
                {participantStore.commitee.name}
              </Heading>
            </Box>
            <Value
              size="small"
              value={participantStore.commitee.membersCount}
              units="Members"
            />
          </Box>
        </Box>
      </Tile>
    ) : (
      <Tile
        colorIndex="light-2"
        align="start"
        margin={{ bottom: "small" }}
        pad={{ horizontal: "medium", vertical: "small" }}
        direction="row"
        responsive={false}
        onClick={() => {}}
      >
        <Heading tag="h3" margin="none">
          <Status value="warning" />
          You haven't been assigned to a committee yet
        </Heading>
      </Tile>
    )
);
