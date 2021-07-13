import React, { useState, useEffect } from "react";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { TabButton, Flex, Column, BigNumber, BigNumberDesc, MainContainer, Source } from "./styles";
import { getInfo } from "services/api";

import { format } from "utils";

interface Data {
  val1: number;
  val1Type: string;
  val2: number;
  val2Type: string;
  val3: number;
  val3Type: string;

  source: string;

  state: string;
  desag: string;
  sector: string;

  color: string;
}

const DataInfo: React.FC = () => {
  const { eixo, ano, num, cad, uf, deg } = useSelection();
  const { desc } = useData();

  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<0|1>(0);

  // Sempre que o eixo mudar, volte pra aba 0
  useEffect(() => {
    setTab(0);
  }, [eixo]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await getInfo(eixo, { var: num, ano, cad, uf, deg });
      setData({
        val1: data.val1,
        val1Type: data.tipo_val1,
        val2: data.val2,
        val2Type: data.tipo_val2,
        val3: data.val3,
        val3Type: data.tipo_val3,
        source: data.fonte,
        sector: data.cadeia,
        state: data.uf,
        desag: data.desag,
        color: data.cor
      });
    };

    getData();
  }, [eixo, num, ano, cad, uf, deg]);

  if (!data) {
    return <></>;
  }

  const tabs = () => {
    // Só eixos do Mercado, Fomento e Comércio Internacional têm abas
    if (![2, 3, 4].includes(eixo)) {
      return false;
    }

    const [leftButtonText, rightButtonText] = [
      [undefined, undefined], // Eixo 1 não tem abas
      ["Setor", "Ocupação"],
      ["Recebedor", "Trabalhador"],
      ["Bens", "Serviços"]
    ][eixo - 1];

    return (
      <Flex>
        <TabButton>{leftButtonText}</TabButton>
        <TabButton>{rightButtonText}</TabButton>
      </Flex>
    );
  };

  // Mostra os valores escolhidos em uma coluna
  const displayValue = (...values: (0 | 1 | 2)[]) => {
    const elements = values.map((which) => {
      if (!desc[eixo - 1][num.toString()][which]) {
        return false;
      }

      const accessor = (uf === 0 ? "" : "u") + (cad === 0 ? "" : "s") + (deg === 0 ? "" : "d");
      const d = desc[eixo - 1][num.toString()][which][accessor];

      if (!d) {
        return false;
      }

      const text = d
        .replace(/\[deg\]/gi, data.desag)
        .replace(/\[uf\]/gi, data.state)
        .replace(/\[cad\]/gi, data.sector)
        .replace(/\[ano\]/gi, ano.toString());

      const [value, type] = (
        [
          [data.val1, data.val1Type],
          [data.val2, data.val2Type],
          [data.val3, data.val3Type]
        ] as [number, string][]
      )[which];

      return (
        <div key={which}>
          <BigNumber>{format(value, type)}</BigNumber>
          <BigNumberDesc>{text}</BigNumberDesc>
        </div>
      );
    })
    .filter(e => e !== false);

    return elements.length > 0 && (
      <Column>
        {elements}
      </Column>
    );
  };

  return (
    <>
      {tabs()}
      <MainContainer style={{ color: data.color }}>
        {displayValue(0)}
        {displayValue(1, 2)}
      </MainContainer>
      <Source>
        Fonte: {data.source ? data.source : 'Sem fonte'}
      </Source>
    </>
  );
};

export default DataInfo;
