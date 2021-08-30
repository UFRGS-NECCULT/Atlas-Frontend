import React, { createContext, useContext, useState } from "react";

import DATA_JSON from "../assets/json/pt-br.json";
import COLOR_JSON from "../assets/json/colors.json";
import { descriptions } from "data/descriptions";

interface DataContextData {
  data: IOptions;
  colors: IColors;
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

//TODO: Arrumar para todos os modelos no JSON
export interface IColors {
  [key: string]: {
    [key: string]: {
      name: string;
      color: string;
      gradient: {
        "1": string;
        "2": string;
        "3": string;
        "4": string;
        "5": string;
        "6": string;
      };
    }[];
  }[];
}

const DataContext = createContext<DataContextData>({} as DataContextData);

const DataProvider: React.FC = ({ children }) => {
  const [data] = useState(JSON.parse(JSON.stringify(DATA_JSON)));
  const [colors] = useState(JSON.parse(JSON.stringify(COLOR_JSON)));
  const [desc] = useState(descriptions);

  return <DataContext.Provider value={{ data, colors, desc }}>{children}</DataContext.Provider>;
};

const useData = (): DataContextData => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData necessita do DataProvider");
  }

  return context;
};

export { DataProvider, useData };
