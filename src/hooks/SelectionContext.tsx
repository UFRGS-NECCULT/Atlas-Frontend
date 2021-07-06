import React, { createContext, useContext, useState, useEffect } from "react";
import qs from "query-string";

import SELECTION_JSON from "../assets/json/select.json";

interface SelectionContextData {
  options: IOptions;
  changeSelection(selector: string, value: number): void;
  ano: number;
  eixo: number;
  num: number;
  uf: number;
  cad: number;
  prt: number;
  deg: number;
}

export interface ISimpleOptions {
  name: string;
  value?: string | number;
  id?: string | number;
}

interface IOptions {
  [key: string]: ISimpleOptions[] & ISimpleOptions[][];
}

const SelectionContext = createContext<SelectionContextData>({} as SelectionContextData);

const SelectionProvider: React.FC = ({ children }) => {
  const baseURL = "/resultado";

  const [eixo, setEixo] = useState<number>(0);
  const [num, setNum] = useState<number>(1);
  const [uf, setUF] = useState<number>(0);
  const [cad, setCad] = useState<number>(0);
  const [prt, setPrt] = useState<number>(0);
  const [ano, setAno] = useState<number>(2016);
  const [deg, setDeg] = useState<number>(0);

  const [options, setOptions] = useState<IOptions>({});

  const location = window.location.toString();

  useEffect(() => {
    if (window.location.search) {
      const parsed = qs.parse(window.location.search);

      if (parsed.eixo) {
        setEixo(Number(parsed.eixo));
      }
      if (parsed.ano) {
        setAno(Number(parsed.ano));
      }
      if (parsed.num) {
        setNum(Number(parsed.num));
      }
      if (parsed.uf) {
        setUF(Number(parsed.uf));
      }
      if (parsed.cad) {
        setCad(Number(parsed.cad));
      }
      if (parsed.prt) {
        setPrt(Number(parsed.prt));
      }
      if (parsed.deg) {
        setDeg(Number(parsed.deg));
      }
    }
  }, [location]);

  const changeSelection = (selector: string, value: number) => {
    /* Mudando a variável global */
    switch (selector) {
      case "uf":
        setUF(value);
        break;
      case "ano":
        setAno(value);
        break;
      case "cad":
        setCad(value);
        break;
      case "prt":
        setPrt(value);
        break;
      case "var":
        setNum(value);
        break;
      case "deg":
        setDeg(value);
        break;
      case "eixo":
        setEixo(value);
        break;
      default:
        console.error("Seletor não existe");
        break;
    }

    /* Mudando a variabel na URL */
    const parsed = qs.parse(window.location.search);
    parsed[selector] = value.toString();
    const stringified = qs.stringify(parsed);
    history.pushState({}, "", `${baseURL}?${stringified}`);
  };

  useEffect(() => {
    const options = JSON.parse(JSON.stringify(SELECTION_JSON));
    setOptions(options);
  }, []);

  return (
    <SelectionContext.Provider
      value={{
        options,
        eixo,
        uf,
        num,
        ano,
        cad,
        prt,
        deg,
        changeSelection
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

const useSelection = (): SelectionContextData => {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection necessita do SelectionProvider");
  }

  return context;
};

export { SelectionProvider, useSelection };
