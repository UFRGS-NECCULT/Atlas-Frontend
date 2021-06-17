import React, { createContext, useContext, useState, useEffect } from "react";

import DATA_JSON from "../assets/json/pt-br.json";

interface DataContextData {
  data: IOptions;
}

interface IOptions {
  [key: string]: {
    name: string;
    value?: string | number;
    id?: string | number;
  }[];
}

const DataContext = createContext<DataContextData>({} as DataContextData);

const DataProvider: React.FC = ({ children }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(JSON.parse(JSON.stringify(DATA_JSON)));
  }, []);

  return (
    <DataContext.Provider
      value={{
        data
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const useData = (): DataContextData => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData necessita do DataProvider");
  }

  return context;
};

export { DataProvider, useData };
