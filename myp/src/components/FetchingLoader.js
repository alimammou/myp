import React from "react";
import Box from "grommet/components/Box";
import { observer } from "mobx-react";
import Spinner from "grommet/components/icons/Spinning";
import styled from "styled-components";

export default observer(
  (
    { store, partnerStore, overlay, overlayWhenPartner } = {
      overlay: false,
      overlayWhenPartner: false
    }
  ) => {
    const loader =
      overlay ||
      (overlayWhenPartner &&
        (partnerStore &&
          (partnerStore.isSyncing || partnerStore.isFetching))) ? (
        <Overlay flex pad="medium" align="center" justify="center">
          <Spinner size="large" />
        </Overlay>
      ) : (
        <Box flex pad="medium" align="center" justify="center">
          <Spinner size="large" />
        </Box>
      );
    return store.isFetching ||
      (partnerStore && (partnerStore.isSyncing || partnerStore.isFetching))
      ? loader
      : null;
  }
);

export const FullscreenLoader = () => (
  <Box flex pad="medium" align="center" justify="center">
    <Spinner size="large" />
  </Box>
);

export const FetchingLoaderOverlay = observer(({ store, partnerStore }) => {
  return store.isFetching ||
    (partnerStore && (partnerStore.isSyncing || partnerStore.isFetching)) ? (
    <Overlay flex pad="medium" align="center" justify="center">
      <Spinner size="large" />
    </Overlay>
  ) : null;
});

const Overlay = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
