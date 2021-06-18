import React from "react";

import Tile from "grommet/components/Tile";
import Tiles from "grommet/components/Tiles";
import Anchor from "grommet/components/Anchor";
import Status from "grommet/components/icons/Status";
import AddCircle from "grommet/components/icons/base/AddCircle";
import { observer } from "mobx-react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import UserIcon from "grommet/components/icons/base/User";
import router from "../stores/router";
import Observer from "./LazyObserver";
import participantsStore from "../stores/moderator/participants";
import styled from "styled-components";

const UserTiles = observer(({ users, dontStretch, ignoreClick }) => (
  <Tiles selectable flush={false} fill={!dontStretch}>
    {users.map(user => (
      <UserTile key={user.id} user={user} isPart ignoreClick={ignoreClick} />
    ))}
  </Tiles>
));

const UserTile = ({ user, ignoreClick }) => {
  return (
    <Observer
      once
      onClick={() =>
        ignoreClick
          ? ""
          : router.push(`/dashboard/applications/${user.userProfile.id}`)
      }
      className="grommetux-box grommetux-box--direction-column grommetux-box--align-start grommetux-box--responsive grommetux-box--pad-none grommetux-background-color-index-light-2 grommetux-background-color-index--light grommetux-box--clickable grommetux-tile grommetux-tile--selectable grommetux-none-hover-color-index-disabled grommetux-tile--hover-border-small"
    >
      {isVisible => (
        <Box
          direction="row"
          pad={{
            horizontal: "medium",
            vertical: "medium",
            between: "small"
          }}
          responsive={false}
          align="start"
          style={{ height: 120, minWidth: 340 }}
        >
          {isVisible ? (
            <React.Fragment>
              <UserIcon />
              <Box align="start">
                <strong>{user.name}</strong>

                <Box align="start">
                  {!user.party ? (
                    <Box direction="row" justify="start" responsive={false}>
                      <Status size="small" value="warning" />
                      Party not assigned
                    </Box>
                  ) : null}
                  {!user.commity ? (
                    <Box direction="row" justify="start" responsive={false}>
                      <Status size="small" value="warning" />
                      Commity not assigned
                    </Box>
                  ) : null}
                </Box>
              </Box>
            </React.Fragment>
          ) : null}
        </Box>
      )}
    </Observer>
  );
};

export const EndorsementTiles = observer(({ users }) => (
  <Tiles selectable flush={false} >
    {users.map(user => (
      <EndorsemntTile key={user.id} user={user} isPart />
    ))}
  </Tiles>
));

const EndorsemntTile = ({ user }) => {
  return (
    <Observer
      once
      onClick={() => {}}
      style={{ minHeight: 120, minWidth: 340 }}
      className="grommetux-box grommetux-box--direction-column grommetux-box--align-start grommetux-box--responsive grommetux-box--pad-none grommetux-background-color-index-light-2 grommetux-background-color-index--light grommetux-box--clickable grommetux-tile grommetux-tile--selectable grommetux-none-hover-color-index-disabled grommetux-tile--hover-border-small"
    >
      {isVisible => <ObservedT isVisible={isVisible} user={user} />}
    </Observer>
  );
};

const ObservedT = observer(({ isVisible, user }) => (
  <Box
    direction="row"
    pad={{
      between: "small"
    }}
    responsive={true}
    align="start"
    style={{
      width: "100%",
      height: "100%",
      minHeight: 120,
      minWidth: 340
    }}
  >
    {isVisible ? (
      <React.Fragment>
        <Box
          pad={{ vertical: "medium", between: "small", horizontal: "medium" }}
          direction="row"
          responsive={false}
          flex
        >
          <UserIcon />
          <Box align="start" flex>
            <Heading tag="h4" strong>{user.name}</Heading>

            <Box align="start" />
          </Box>
        </Box>

        <Box
          responsive={false}
          align="stretch"
          pad={{ vertical: "none" }}
          style={{ height: "100%" }}
        >
          <EndAnchor
            icon={<AddCircle />}
            reverse
            primary
            align="end"
            onClick={user.endorseLeadership}
            type="leadership"
          >
            <EndAnchorCounter>{user.leadership}</EndAnchorCounter>
            <span>Leadership</span>
          </EndAnchor>
          <EndAnchor
            icon={<AddCircle />}
            reverse
            primary
            align="end"
            type="content"
            onClick={user.endorseContent}
          >
            <EndAnchorCounter>{user.content}</EndAnchorCounter>
            <span>Content</span>
          </EndAnchor>
          <EndAnchor
            icon={<AddCircle />}
            reverse
            primary
            align="end"
            onClick={user.endorseManagement}
            type="management"
          >
            <EndAnchorCounter>{user.management}</EndAnchorCounter>
            <span>Engagement</span>
          </EndAnchor>
        </Box>
      </React.Fragment>
    ) : null}
  </Box>
));

export default UserTiles;

const EndAnchorCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 40px;
  min-width: 40px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-left: -10px;
  margin-right: 10px;
`;

const EndAnchor = styled(Anchor)`
  display: flex;
  flex: 1 !important;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  color: white !important;
  min-height:40px;

  & > svg {
    fill: white !important;
    stroke: white !important;
  }

  ${({ type }) => (type === "leadership" ? `background-color:#009EE3;` : "")}
  ${({ type }) => (type === "content" ? `background-color:#E5007D;` : "")}
  ${({ type }) => (type === "management" ? `background-color:#49516f;` : "")}
`;
