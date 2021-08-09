import React from "react";
import { StyledLoader } from "./styles";
import GridLoader from "react-spinners/GridLoader";

interface LoaderProps {
  loading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ loading, children }) => {
  return (
    <StyledLoader active={loading} classNamePrefix="MyLoader_" spinner={<GridLoader color={"#6dbfc9"} size={50} />}>
      {children}
    </StyledLoader>
  );
};
