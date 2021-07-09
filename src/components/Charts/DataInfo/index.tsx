import React, { useState } from "react";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { TabButton, Flex, Column, BigNumber, BigNumberDesc, MainContainer } from "./styles";
import { getInfo } from "services/api";
import { useEffect } from "react";
import { format } from "utils";

interface Data {
  val1: number;
  val1Type: string;
  val2: number;
  val2Type: string;
  val3: number;
  val3Type: string;

  state: string;
  desag: string;
  sector: string;

  color: string;
}

const DataInfo: React.FC = () => {
  const { eixo, ano, num, cad, uf, deg, prt } = useSelection();
  const { desc } = useData();

  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const getData = async () => {
      const { data } = await getInfo(eixo + 1, { var: num, ano, cad, uf, prt, deg });
      setData({
        val1: data.val1,
        val1Type: data.tipo_val1,
        val2: data.val2,
        val2Type: data.tipo_val2,
        val3: data.val3,
        val3Type: data.tipo_val3,
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
    if (![1, 2, 3].includes(eixo)) {
      return false;
    }

    const [leftButtonText, rightButtonText] = [
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

  const displayValue = (which: 0 | 1 | 2) => {
    if (!desc[eixo][num.toString()][which]) {
      return false;
    }

    const accessor = (uf === 0 ? "" : "u") + (cad === 0 ? "" : "s") + (deg === 0 ? "" : "d");
    const d = desc[eixo][num.toString()][which][accessor];

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
      <>
        <BigNumber>{format(value, type)}</BigNumber>
        <BigNumberDesc>{text}</BigNumberDesc>
      </>
    );
  };

  return (
    <>
      {tabs()}
      <MainContainer style={{ color: data.color }}>
        <Flex>
          <Column>{displayValue(0)}</Column>
        </Flex>
        <Flex>
          <Column>
            {displayValue(1)}
            {displayValue(2)}
          </Column>
        </Flex>
      </MainContainer>
    </>
  );
};

export default DataInfo;
