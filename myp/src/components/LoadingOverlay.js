import React from "react";
import styled from "styled-components";
import Spinning from "grommet/components/icons/Spinning";
import Headline from "grommet/components/Headline";

const Overlay = styled.div`
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

export default ({ loading, message }) => {
  return loading ? (
    <Overlay>
      {message ? <Headline size="small">{message}</Headline> : null}
      <Spinning size="large" />
    </Overlay>
  ) : null;
};
