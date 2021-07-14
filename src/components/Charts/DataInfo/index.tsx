import React, { useState, useEffect } from "react";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { TabButton, Flex, Column, BigNumber, BigNumberDesc, MainContainer, Source } from "./styles";
import { getInfo } from "services/api";

import { format } from "utils";

interface Data {
  selection: {
    eixo: number;
    ano: number;
    num: number;
    cad: number;
    uf: number;
    deg: number;
    ocp: number;
  };
  data: DataPoint[];
}

interface DataPoint {
  valor: number;
  ano: number;
  cor: string;
  formato: string;
  fonte: string;
  id_uf: number;
  nome_uf: string;
  id_cad: number;
  nome_cad: string;
  id_subdeg: number;
  nome_subdeg: string;
  id_ocupacao?: number;
  nome_ocupacao?: string;
}

const DataInfo: React.FC = () => {
  const { eixo, ano, num, cad, uf, deg } = useSelection();
  // TODO: ocp no useSelection()
  const ocp = 0;
  const { desc } = useData();

  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<0 | 1>(0);

  // Sempre que o eixo mudar, volte pra aba 0
  useEffect(() => {
    setTab(0);
  }, [eixo]);

  useEffect(() => {
    const selection = { eixo, ano, num, cad, uf, deg, ocp };
    const getData = async () => {
      const { data } = await getInfo(selection.eixo, { ...selection, var: selection.num });
      setData({ selection, data });
    };

    getData();
  }, [eixo, num, ano, cad, uf, deg]);

  const tabs = (data: Data) => {
    // Só eixos do Mercado, Fomento e Comércio Internacional têm abas
    if (![2, 3, 4].includes(data.selection.eixo)) {
      return false;
    }

    const [leftButtonText, rightButtonText] = [
      [undefined, undefined], // Eixo 1 não tem abas
      ["Setor", "Ocupação"],
      ["Recebedor", "Trabalhador"],
      ["Bens", "Serviços"]
    ][data.selection.eixo - 1];

    return (
      <Flex>
        <TabButton className={tab === 0 ? 'active' : ''} onClick={() => setTab(0)}>{leftButtonText}</TabButton>
        <TabButton className={tab === 1 ? 'active' : ''} onClick={() => setTab(1)}>{rightButtonText}</TabButton>
      </Flex>
    );
  };

  // Diz se uma string contém uma certa expressão de substituição, como "[cad]" ou "[uf]"
  const has = (expr: string, target: string): boolean => {
    const regex = new RegExp(`\\[${expr}\\]`, "gi");
    return regex.test(target);
  };

  // Acha a entrada correta para um valor baseando-se na seleção
  // de valores do breadcrumb
  const findSelectedData = (data: Data) => {
    const d = data.data.find(
      (d) =>
        d.id_uf === data.selection.uf&&
        d.id_cad === data.selection.cad&&
        d.id_subdeg === data.selection.deg &&
        (d.id_ocupacao ? d.id_ocupacao === data.selection.ocp : true)
    );

    return d || null;
  }

  // Acha a entrada correta para um valor baseando-se nas expressões
  // de substituição encontradas na string que descreve esse valor
  const findCorrectData = (str: string, data: Data) => {
    const d = data.data.find(
      (d) =>
        d.id_uf === (has("uf", str) ? data.selection.uf : 0) &&
        d.id_cad === (has("cad", str) ? data.selection.cad : 0) &&
        d.id_subdeg === (has("deg", str) ? data.selection.deg : 0) &&
        (d.id_ocupacao ? d.id_ocupacao === (has("ocp", str) ? data.selection.ocp : 0) : true)
    );

    return d || null;
  };

  // Realiza as substituições necessárias na string de descrição
  const description = (desc: string, data: DataPoint): string => {
    return desc
      .replace(/\[uf\]/gi, data.nome_uf)
      .replace(/\[cad\]/gi, data.nome_cad)
      .replace(/\[ano\]/gi, data.ano.toString())
      .replace(/\[deg\]/gi, data.nome_subdeg)
      .replace(/\[ocp]/gi, data.nome_ocupacao||'');
  };

  const displayValues = () => {
    if (!data) {
      return false;
    }

    // Se não há definição para esses valores, não mostre nada
    const tabs = desc[data.selection.eixo - 1][data.selection.num.toString()];
    const descriptions = tabs ? tabs[tab] : null;
    if (!data || !descriptions || !descriptions[0]) {
      return false;
    }

    const accessor =
      (data.selection.uf !== 0 ? "u" : "") +
      (data.selection.cad !== 0 ? "s" : "") +
      (data.selection.ocp !== 0 ? "o" : "") +
      (data.selection.deg !== 0 ? "d" : "");

    const mainStr = descriptions[0][accessor];
    // Se a variável principal não está definida, não mostre nenhum valor
    if (!mainStr || mainStr === "") {
      return false;
    }
    const main = mainStr.trim() === "" ? findSelectedData(data) : findCorrectData(mainStr, data);

    let scndStr = "";
    let scnd: DataPoint | null = null;
    if (descriptions[1] && descriptions[1][accessor]) {
      scndStr = descriptions[1][accessor];
      scnd = findCorrectData(scndStr, data);
    }

    let thrdStr = "";
    let thrd: DataPoint | null = null;
    if (descriptions[2] && descriptions[2][accessor]) {
      thrdStr = descriptions[2][accessor];
      thrd = findCorrectData(thrdStr, data);
    }

    return [
      main && <Column key="0">
        <BigNumber>{format(main.valor, main.formato)}</BigNumber>
        <BigNumberDesc>{description(mainStr, main)}</BigNumberDesc>
      </Column>,
      (scnd || thrd) && (
        <Column key="1">
          {scnd && (
            <>
              <BigNumber>{format((main?.valor||0) / scnd.valor, "percent")}</BigNumber>
              <BigNumberDesc>{description(scndStr, scnd)}</BigNumberDesc>
            </>
          )}
          {thrd && (
            <>
              <BigNumber>{format((main?.valor||0) / thrd.valor, "percent")}</BigNumber>
              <BigNumberDesc>{description(thrdStr, thrd)}</BigNumberDesc>
            </>
          )}
        </Column>
      )
    ];
  };

  if (!data || !data.data.length) {
    return <></>;
  }

  return (
    <>
      {tabs(data)}
      <MainContainer style={{ color: data.data[0].cor }}>{displayValues()}</MainContainer>
      <Source>Fonte: {data.data[0].fonte ? data.data[0].fonte : "Sem fonte"}</Source>
    </>
  );
};

export default DataInfo;
