import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
`;

export const Column = styled.div`
  flex-direction: column;
  padding-left: 4px;
  padding-right: 4px;
`;

export const TabButton = styled.div`
  font-weight: bold;
  text-align: center;
  width: 50%;
  color: white;
  background-color: #6dbfc9;

  :nth-child(1) {
    margin-right: 2px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  :nth-child(2) {
    margin-left: 2px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
`;

export const BigNumber = styled.span`
  font-size: 4vw;
  display: inline-block;
  text-align: center;
  width: 100%;
`;

export const BigNumberDesc = styled.span`
  text-transform: uppercase;
  display: inline-block;
  text-align: center;
  font-size: 1vw;
  color: gray;
  width: 100%;
`;
