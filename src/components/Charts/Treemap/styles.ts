import styled from "styled-components";

export const TreemapContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
