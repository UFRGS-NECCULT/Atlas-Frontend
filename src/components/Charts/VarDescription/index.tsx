import { useData } from "hooks/DataContext";
import { useSelection } from "hooks/SelectionContext";
import React, { useState, useEffect } from "react";

import { Text } from "./styles";

const VarDescription: React.FC = () => {
  const { data } = useData();
  const { eixo, num } = useSelection();

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data.var) {
      setDescription((data.var[eixo - 1] as any).find((d) => d.id === num).desc);
    }
  }, [data, eixo, num]);

  return <Text>{description}</Text>;
};

export default VarDescription;
