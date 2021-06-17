import React from "react";
import { BoxTitle, Container } from "./styles";

interface BoxProps {
  title?: string;
  id: string;
}

const Box: React.FC<BoxProps> = ({ children, id, title }) => {
  return (
    <Container id={id}>
      <BoxTitle>{title}</BoxTitle>
      {children}
    </Container>
  );
};

export default Box;
