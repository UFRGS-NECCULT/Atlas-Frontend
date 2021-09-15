import React, { createContext, useContext, useState } from "react";

import { descriptions } from "data/descriptions";

interface DataContextData {
  desc: IDescriptions;
}

// Descrições do componente DataInfo, no formato
// desc[eixo][variavel][aba (entre 0 e 1)][numero (entre 0 e 2)]
export interface IDescriptions {
  [eixo: number]: {
    [num: string]: string[][];
  };
}

export interface IOptions {
  [key: string]: {
    name: string;
    value?: string | number;
    id?: string | number;
  }[];
}

const DataContext = createContext<DataContextData>({} as DataContextData);

const DataProvider: React.FC = ({ children }) => {
  const [desc] = useState(descriptions);

  return <DataContext.Provider value={{ desc }}>{children}</DataContext.Provider>;
};

const useData = (): DataContextData => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData necessita do DataProvider");
  }

  return context;
};

export { DataProvider, useData };
