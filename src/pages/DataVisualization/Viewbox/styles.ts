import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

export const ChartButtons = styled.div`
  width: 100%;
  margin-bottom: 4px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  button {
    width: 120px;
    height: 17px;
    color: #fff;
    line-height: 12px;

    border: none;
    cursor: pointer;
  }

  button:first-child {
    border-radius: 10px 0px 0px 10px;
  }

  button:nth-child(2) {
    border-radius: 0px 10px 10px 0px;
  }

  button + button {
    margin-left: 2px;
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
`;
