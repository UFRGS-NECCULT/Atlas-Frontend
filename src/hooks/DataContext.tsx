import React, { createContext, useContext, useState, useEffect } from "react";

import DATA_JSON from "../assets/json/pt-br.json";
import COLOR_JSON from "../assets/json/colors.json";
import DESC_JSON from "../assets/json/descricoes.json";

interface DataContextData {
  data: IOptions;
  colors: IColors;
  desc: IDescriptions;
}

interface IDescriptions {
  [eixo: number]: {
    [num: string]: {
      [tab in 0|1]: {
        [data in 0|1|2]: {
          [key: string]: string;
        };
      };
    };
  };
}

interface IOptions {
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
  const [data, ] = useState(JSON.parse(JSON.stringify(DATA_JSON)));
  const [colors, ] = useState(JSON.parse(JSON.stringify(COLOR_JSON)));
  const [desc, ] = useState(JSON.parse(JSON.stringify(DESC_JSON)));

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
