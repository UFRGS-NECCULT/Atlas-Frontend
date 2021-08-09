import React from "react";
import { BoxTitle, Container } from "./styles";

interface BoxProps {
  title?: string;
  id: string;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, id, title, className }) => {
  return (
    <Container className={className} id={id}>
      <BoxTitle>{title}</BoxTitle>
      {children}
    </Container>
  );
};

export default Box;
