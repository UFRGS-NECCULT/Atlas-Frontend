import styled from "styled-components";
import background from "assets/images/background.jpg";

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
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    img {
      width: 35%;
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
`;
