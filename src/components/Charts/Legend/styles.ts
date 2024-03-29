import styled from "styled-components";

export const Container = styled.div`
  padding: 0 15px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  width: 100%;

  font-size: 26px;
  text-transform: uppercase;
  letter-spacing: 10px;
  line-height: 40px;
  text-align: center;
`;

export const List = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    flex-direction: row;
  }
  .box-small & {
    flex-direction: row;
  }
`;

export const Setor = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    width: 50%;
  }
  .box-small & {
    width: 50%;
  }

  display: flex;

  &.clickable {
    cursor: pointer;
  }

  & + & {
    margin-top: 5px;
  }

  i {
    height: 10px;
    width: 10px;
    background-color: #071342;
  }

  span {
    text-align: left;
    font-size: 8px;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 2px;
    margin-left: 5px;
  }
`;
