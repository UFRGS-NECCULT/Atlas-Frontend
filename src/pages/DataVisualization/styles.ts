import styled from "styled-components";
import { LinearProgress } from "@material-ui/core";

export const Page = styled.div`
  overflow-x: hidden;
  margin-bottom: 8px;
`;

export const Container = styled.div`
  width: 100vw;
  max-width: 1366px;
  margin: 0 auto;

  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: 0 64px;
  }
`;

export const Title = styled.div`
  width: 100%;

  font-size: 26px;
  text-transform: uppercase;
  letter-spacing: 10px;
  line-height: 40px;
  text-align: center;

  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Viewboxes = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  padding: 15px;

  .row + .row {
    margin-top: 15px;
  }
  .row {
    width: 100%;
    display: flex;
    flex-direction: row;

    .col + .col {
      margin-left: 15px;
    }
    .col {
      width: 50%;

      display: flex;
      flex-direction: column;

      .box {
        width: 100%;
        padding: 15px;
      }

      .box.expand {
        height: 100%;
      }

      .box + .box {
        margin-top: 15px;
      }
    }
  }

  #box-1,
  #box-4 {
    min-height: 330px;
  }

  #box-3 {
    min-height: 120px;
    overflow: auto;
  }

  #box-5 {
    width: 100%;
    min-height: 440px;
  }

  @media (max-width: 768px) {
    .col + .col {
      margin-left: 0;
    }

    .row + .row {
      margin-top: 0;
    }
    .row {
      flex-direction: column;
      width: 100%;

      .col + .col {
        margin-left: 0px;
      }

      .col {
        width: 100%;
        padding: 8px;

        .box {
          width: 100%;
        }

        display: flex;
      }
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

export const FooterTitle = styled.div``;
export const DownloadOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

export const Loading = styled(LinearProgress)`
  width: 100%;
  height: 20px;
  margin-top: 15px;
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

  color: #fff;
  line-height: 12px;
  vertical-align: middle;
  width: 100%;
  height: 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.5s;
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
