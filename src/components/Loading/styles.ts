import styled from "styled-components";
import LoadingOverlay from "react-loading-overlay";

export const StyledLoader = styled(LoadingOverlay)`
  overflow: scroll;
  .MyLoader_overlay {
    background: rgba(0, 0, 0, 0.4);
  }
  &.MyLoader_wrapper--active {
    overflow: hidden;
  }
`;
