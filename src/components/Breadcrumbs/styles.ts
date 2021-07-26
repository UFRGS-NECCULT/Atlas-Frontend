import styled from "styled-components";

export const MobileBar = styled.div`
  @media (max-width: 768px) {
    width: 75%;
    height: 100vh;
    z-index: 3;

    background-color: white;

    position: fixed;
    left: -75%;

    &.active {
      left: 0;
      box-shadow: 0 5px 50px rgba(0, 0, 0, 0.5);
    }
  }

  transition: left 0.25s, box-shadow 0.25s;
`;

export const Children = styled.div`
  // 32 + 4 (altura do botão + margem do botão mobile)
  @media (max-width: 768px) {
    margin-top: 36px;
  }

  transition: transform 0.25s;

  transform: translate(0px);
  &.active {
    transform: translate(75%);
  }
`;

export const Container = styled.div`
  width: 100vw;
  overflow-x: hidden;
`;

export const Selects = styled.div`
  width: 100%;

  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom: 1px #f7f7f7 solid;
  // position: fixed;

  padding-left: 2%;
  padding-right: 2%;

  // top: 0;
  // left: 0;
  // z-index: 99;
  background-color: white;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
`;

export const MobileButton = styled.div`
  border-radius: 10px;
  background-color: #6dbfc9;
  color: #fff;

  margin: 4px;
  padding: 8px;
  height: 32px;

  cursor: pointer;

  align-self: start;
  align-items: center;

  display: none;

  z-index: 2;

  &.open {
    position: fixed;
  }

  @media (max-width: 768px) {
    display: inline-block;
  }
`;
