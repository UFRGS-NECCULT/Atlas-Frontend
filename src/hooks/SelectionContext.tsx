import React, { createContext, useContext, useState, useEffect } from "react";
import qs from "query-string";

import { getConfig, getVariable } from "services/api";

interface SelectionContextData {
  config: IEixoConfig;
  changeSelection(selector: string, value: number): void;
  ano: number;
  eixo: number;
  num: number;
  uf: number;
  cad: number;
  cns: number;
  prc: number;
  tpo: number;
  deg: number;
  variableInfo: IVariableInfo;
}

interface IEixoConfig {
  primaryColor: string;
  breadcrumbs: ISimpleBreadCrumb[];
}

export interface ISimpleBreadCrumb {
  id: string;
  label: string;
  options: IBreadCrumbOptions[];
}

interface IBreadCrumbOptions {
  nome: string;
  id: number;
}

interface IVariableInfo {
  descricao: string;
  fonte: string;
  formato: string;
  titulo: string;
}

const SelectionContext = createContext<SelectionContextData>({} as SelectionContextData);

const SelectionProvider: React.FC = ({ children }) => {
  const baseURL = "/resultado";

  // Valores padrões iniciais
  let _eixo = 1;
  let _num = 1;
  let _uf = 0;
  let _cad = 0;
  let _ano = 2016;
  let _deg = 0;
  let _prc = 0;
  let _tpo = 1;
  let _cns = 0;

  // Verificar se não há valores iniciais já informados na url
  if (window.location.search) {
    const parsed = qs.parse(window.location.search);

    if (parsed.eixo) {
      _eixo = Number(parsed.eixo);
    }
    if (parsed.ano) {
      _ano = Number(parsed.ano);
    }
    if (parsed.var) {
      _num = Number(parsed.var);
    }
    if (parsed.uf) {
      _uf = Number(parsed.uf);
    }
    if (parsed.cad) {
      _cad = Number(parsed.cad);
    }
    if (parsed.deg) {
      _deg = Number(parsed.deg);
    }
    if (parsed.tpo) {
      _tpo = Number(parsed.tpo);
    }
    if (parsed.cns) {
      _cns = Number(parsed.cns);
    }
    if (parsed.prc) {
      _prc = Number(parsed.prc);
    }
  }

  const [eixo, setEixo] = useState<number>(_eixo);
  const [num, setNum] = useState<number>(_num);
  const [uf, setUF] = useState<number>(_uf);
  const [cad, setCad] = useState<number>(_cad);
  const [ano, setAno] = useState<number>(_ano);
  const [deg, setDeg] = useState<number>(_deg);
  const [prc, setPrc] = useState<number>(_prc);
  const [tpo, setTpo] = useState<number>(_tpo);
  const [cns, setCns] = useState<number>(_cns);
  const [variableInfo, setVariableInfo] = useState<IVariableInfo>({
    descricao: "",
    fonte: "",
    formato: "",
    titulo: ""
  });

  const [config, setConfig] = useState<IEixoConfig>({
    primaryColor: "transparent",
    breadcrumbs: []
  });

  useEffect(() => {
    const getOptions = async (eixo, num) => {
      const { data } = await getConfig(eixo, num);
      setConfig(data);

      // Resetar opções inválidas
      const variables = [
        ["uf", uf],
        ["ano", ano],
        ["var", num],
        ["cad", cad],
        ["deg", deg],
        ["prc", prc],
        ["tpo", tpo],
        ["cns", cns],
        ["eixo", eixo]
      ];
      for (const v of variables) {
        const [id, value] = v;

        const current_breadcrumb = config.breadcrumbs.find((b) => {
          return b.id === id;
        });

        const options =
          current_breadcrumb && current_breadcrumb.options ? current_breadcrumb.options.map((o) => o.id) : [];
        if (options && options.length) {
          // Se o valor atualmente selecionado não está disponível,
          // selecione um valor padrão
          if (!options.includes(value)) {
            changeSelection(id, options[0]);
          }
        }
      }
    };

    getOptions(eixo, num);
  }, [eixo, num]);

  useEffect(() => {
    const getNum = async (eixo, num) => {
      const { data } = await getVariable(eixo, num);
      setVariableInfo(data);
    };
    getNum(eixo, num);
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
      case "cns":
        setCns(value);
        break;
      case "tpo":
        setTpo(value);
        break;
      case "prc":
        setPrc(value);
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
        config,
        eixo,
        uf,
        num,
        ano,
        cad,
        deg,
        cns,
        prc,
        tpo,
        variableInfo,
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
