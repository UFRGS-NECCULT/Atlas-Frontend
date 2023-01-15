import React from "react";
import { CircularProgress } from "@material-ui/core";
import { Container } from "./styles";

export const Loader: React.FC = () => {
  return (
    <Container>
      <CircularProgress />
    </Container>
  );
};

export default Loader;
