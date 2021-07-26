import styled from "styled-components";

export const Page = styled.div`
  margin-bottom: 8px;
`;

export const Container = styled.div``;

export const Title = styled.div`
  width: 100%;

  font-size: 26px;
  text-transform: uppercase;
  letter-spacing: 10px;
  line-height: 40px;
  text-align: center;
`;

export const Viewboxes = styled.div`
  display: grid;
  padding: 0 15%;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(6, 100px) 450px;
  grid-template-areas:
    "box-1 box-2"
    "box-1 box-2"
    "box-1 box-2"
    "box-1 box-4"
    "box-3 box-4"
    "box-3 box-4"
    "box-5 box-5";
  column-gap: 20px;
  row-gap: 20px;

  @media (max-width: 768px) {
    padding: 8px;

    display: flex;
    flex-direction: column;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FooterTitle = styled.div``;
export const DownloadOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

export const Button = styled.div`
  & + & {
    margin-left: 5px;
  }

  &:nth-child(1) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:nth-child(3) {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  text-transform: uppercase;
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 2px;

  background-color: #6dbfc9;
  color: #fff;
  line-height: 12px;
  vertical-align: middle;
  width: 100%;
  height: 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

export const ChartContainer = styled.div`
  flex: 1 1 auto;
  padding: 15px;
`;

export const ViewOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  button {
    width: 120px;
    height: 17px;
    border-radius: 10px;
    background-color: #6dbfc9;
    color: #fff;
    line-height: 12px;

    border: none;
    cursor: pointer;
  }
`;
