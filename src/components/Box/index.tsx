import React from "react";
import { Container } from "./styles";

interface BoxProps {
  id: string;
}

const Box: React.FC<BoxProps> = ({ children, id }) => {
  return <Container id={id}>{children}</Container>;
};

export default Box;
