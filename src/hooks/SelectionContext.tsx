import React, { createContext, useContext, useState, useEffect } from "react";
import qs from "query-string";

import { getBreadcrumb } from "services/api";

interface SelectionContextData {
  options: ISimpleBreadCrumb[];
  changeSelection(selector: string, value: number): void;
  ano: number;
  eixo: number;
  num: number;
  uf: number;
  cad: number;
  deg: number;
}

export interface ISimpleBreadCrumb {
  id: string;
  label: string;
  options: IOptions[];
}

interface IOptions {
  nome: string;
  id: number;
}

const SelectionContext = createContext<SelectionContextData>({} as SelectionContextData);

const SelectionProvider: React.FC = ({ children }) => {
  const baseURL = "/resultado";

  const [eixo, setEixo] = useState<number>(1);
  const [num, setNum] = useState<number>(1);
  const [uf, setUF] = useState<number>(0);
  const [cad, setCad] = useState<number>(0);
  const [ano, setAno] = useState<number>(2016);
  const [deg, setDeg] = useState<number>(0);

  const [options, setOptions] = useState<ISimpleBreadCrumb[]>([]);

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
      if (parsed.deg) {
        setDeg(Number(parsed.deg));
      }
    }
  }, [location]);

  useEffect(() => {
    const getOptions = async (eixo) => {
      const { data: breadcrumb } = await getBreadcrumb(eixo, num);

      setOptions(breadcrumb);
    };
    getOptions(eixo + 1);
  }, [eixo, num]);

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

  return (
    <SelectionContext.Provider
      value={{
        options,
        eixo,
        uf,
        num,
        ano,
        cad,
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
