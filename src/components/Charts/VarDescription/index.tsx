import { useSelection } from "hooks/SelectionContext";
import React from "react";

import { Text } from "./styles";

const VarDescription: React.FC = () => {
  const { config } = useSelection();

  return <Text>{config.variable.descricao}</Text>;
};

export default VarDescription;
