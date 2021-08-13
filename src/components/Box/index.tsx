import React from "react";
import { Container } from "./styles";

interface BoxProps {
  title?: string;
  id: string;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, id, title, className }) => {
  return (
    <Container className={className} id={id}>
      {children}
    </Container>
  );
};

export default Box;
