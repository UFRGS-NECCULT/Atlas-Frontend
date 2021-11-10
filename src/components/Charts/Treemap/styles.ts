import styled from "styled-components";

export const TreemapContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
  .box-small & {
    flex-direction: column;
  }

  & > svg {
    height: 100%;
    width: 100%;
  }
`;

export const TreemapSVG = styled.svg`
  flex-grow: 1;
`;