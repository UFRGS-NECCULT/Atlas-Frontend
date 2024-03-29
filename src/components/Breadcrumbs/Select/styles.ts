import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 4.5rem;

  padding-left: 4px;
  padding-right: 4px;

  min-width: 100px;
  max-width: 350px;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;
export const Label = styled.label`
  vertical-align: middle;
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 10px;
  font-weight: bold;
  height: 18px;
  border-radius: 10px;
  color: #fff;
  line-height: 12px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Lato Regular;

  transition: background-color 0.5s;
`;
export const Select = styled.select`
  // float: left;

  // Flecha customizada
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-image: url("/img/arrow.png");
  background-position: right center;
  background-repeat: no-repeat;

  background-color: #f0f0f0;
  background-size: 10px;
  // background-position: right center;
  // background-repeat: no-repeat;
  padding: 2px 10px 2px 5px;
  color: #737277;
  border: 1px solid #fff;
  outline: none;
  width: 100%;
  font-size: 10px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 1px;
  // appearance: none;
  // -moz-appearance: none;
  // -webkit-appearance: none;
  margin: 2px 0px 5px 0px;
  // background-image: url(../images/arrow.png);
  cursor: pointer;
  border: 1px #ddd solid;
  // display: block;
`;

export const Option = styled.option``;
