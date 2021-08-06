import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  width: 100%;
  padding-left: 4px;
  padding-right: 4px;
  flex-direction: row;
`;

export const Column = styled.div`
  display: flex;
  width: 100%;
  padding-left: 4px;
  padding-right: 4px;
  flex-direction: column;
`;

export const TabButton = styled.div`
  font-weight: bold;
  text-align: center;
  width: 50%;
  color: white;
  opacity: 0.75;

  &.active {
    opacity: 1;
  }

  &:nth-child(1) {
    margin-right: 2px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  &:nth-child(2) {
    margin-left: 2px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
`;

export const BigNumber = styled.span`
  font-size: 3rem;
  display: inline-block;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const BigNumberDesc = styled.span`
  text-transform: uppercase;
  display: inline-block;
  text-align: center;
  font-size: 0.75rem;
  color: gray;
  width: 100%;
`;

export const Source = styled.div`
  text-align: right;
  width: 100%;
  display: inline-block;
  color: gray;
  font-size: 0.8em;
`;
