import styled from "styled-components";
import background from "assets/images/background.jpg";
import mapa from "assets/images/mapa.png";

export const Page = styled.div`
  height: 100vh;

  .section-with-background {
    height: 100%;

    background-image: url(${background});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .container {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 35%;
      display: flex;
      margin: auto;
    }

    p {
      font-size: 40px;
      color: #ffffff;
      text-transform: uppercase;
      text-align: center;
      font-family: Lato Regular;
    }
  }

  .explorar {
    font-family: Lato Bold;
    font-size: 20px;
    color: #6dbfc9;
    text-transform: uppercase;

    background-color: #ffffff;
    border-radius: 20px 20px 0px 0px;

    padding: 5px 20px 5px 20px;
    bottom: 0px;
    letter-spacing: 10px;

    position: absolute;
  }

  #section2 {
    .intro-text {
      color: #737277;
      font-size: 20px;
      padding-top: 50px;

      text-align: center;
    }

    .separator {
      margin: 50px auto;
      width: 100px;
      border-bottom: 5px solid #5b5b5f;
    }

    .eixos {
      display: grid;
      grid-template-columns: repeat(4, 1fr);

      .eixo {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 75%;
          margin-bottom: 12.5%; // 25% dividido em 2, uma parte em cima e outra em baixo
          margin-top: 12.5%;
          cursor: pointer;

          transition: all 0.4s;
        }

        img: hover {
          width: 100%;
          margin-bottom: 0%;
          margin-top: 0%;
          max-height: 100%;
        }
      }
    }

    .text-atlas {
      display: flex;
      flex-direction: column;

      width: 100%;
      background-image: url(${mapa});
      background-size: 46%;
      background-repeat: no-repeat;
      background-position-x: right;
      background-position-y: bottom;
      height: 920px;
      padding: 0;

      .question-title {
        font-family: Bookman;
        font-size: 39px;
        margin-top: 50px;
        color: #737277;
        padding: 0 8%;
      }

      .question-answer {
        width: 42%;
        padding: 0 8%;
        margin-top: 25px;
        font-family: Lato Regular;
        font-size: 16px;
        text-align: justify;
        padding-right: 30px;
        color: #737277;

        font-family: Lato Regular;
        font-size: 16px;
        text-align: justify;
        padding-right: 30px;
      }
    }

    .final-logo {
      img {
        width: 140px;
        height: auto;
      }
    }

    .footer-container {
      width: 100%;
    }
  }
`;
