import React, { useState, useEffect } from "react";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { TabButton, Flex, Column, BigNumber, BigNumberDesc, Container, Source, Row } from "./styles";
import { getInfo } from "services/api";

import { format, richString, shouldDisplayDescription } from "utils";

interface Data {
  selection: {
    eixo: number;
    ano: number;
    num: number;
    cad: number;
    uf: number;
    deg: number;
    ocp: number;
    prc: number;
    tpo: number;
    cns: number;
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
  preposicao_uf: string;
  id_cad: number;
  nome_cad: string;
  id_subdeg?: number;
  nome_subdeg?: string;
  id_ocupacao?: number;
  nome_ocupacao?: string;
  id_parceiro?: number;
  nome_parceiro?: string;
  id_consumo?: number;
  nome_consumo?: string;
  id_tipo?: number;
  nome_tipo?: string;
  display_subdeg?: string;
}

interface ChartProps {
  constants?: {
    [key: string]: string | number;
  };
}

const DataInfo: React.FC<ChartProps> = ({ constants }) => {
  const selection = useSelection();
  const { eixo, ano, num, cad, uf, deg, prc, cns, tpo, config } = {...selection, ...constants};
  // TODO: ocp no useSelection()
  const ocp = 0;
  const { desc } = useData();

  const [data, setData] = useState<Data | null>(null);

  let tab: 0 | 1 = 0;

  // Escolher aba correta
  if (eixo === 2 && ocp !== 0) {
    tab = 1;
  }

  useEffect(() => {
    const selectionClone = { eixo, ano, num, cad, uf, deg, ocp, prc, cns, tpo, config };
    const getData = async () => {
      const { data } = await getInfo(selectionClone.eixo, { ...selectionClone, var: selectionClone.num });
      setData({ selection: selectionClone, data });
    };

    getData();
  }, [eixo, num, ano, cad, uf, deg, prc, cns, tpo]);

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
        <TabButton className={tab === 0 ? "active" : ""} style={{ backgroundColor: config.primaryColor }}>
          {leftButtonText}
        </TabButton>
        <TabButton className={tab === 1 ? "active" : ""} style={{ backgroundColor: config.primaryColor }}>
          {rightButtonText}
        </TabButton>
      </Flex>
    );
  };

  // Acha a entrada correta para um valor baseando-se na seleção
  // de valores do breadcrumb
  const findSelectedData = (data: Data) => {
    const d = data.data.find(
      (d) =>
        d.id_uf === data.selection.uf &&
        d.id_cad === data.selection.cad &&
        (d.id_subdeg !== undefined ? d.id_subdeg === data.selection.deg : true) &&
        (d.id_ocupacao !== undefined ? d.id_ocupacao === data.selection.ocp : true) &&
        (d.id_parceiro !== undefined ? d.id_parceiro === data.selection.prc : true) &&
        (d.id_tipo !== undefined ? d.id_tipo === data.selection.tpo : true) &&
        (d.id_consumo !== undefined ? d.id_consumo === data.selection.cns : true)
    );

    return d || null;
  };

  // Acha a entrada correta para um valor baseando-se nas expressões
  // de substituição encontradas na string que descreve esse valor
  const findCorrectData = (filters: string[], data: Data) => {
    // Atalho para deixar o código mais enxuto
    // Diz se um nome está presente na lista de filtros
    const i = (name) => filters.includes(name);

    const d = data.data.find(
      (d) =>
        d.id_uf === (i("uf") ? data.selection.uf : 0) &&
        d.id_cad === (i("cad") ? data.selection.cad : 0) &&
        (d.id_subdeg !== undefined ? d.id_subdeg === (i("deg") ? data.selection.deg : 0) : true) &&
        (d.id_ocupacao !== undefined ? d.id_ocupacao === (i("ocp") ? data.selection.ocp : 0) : true) &&
        (d.id_parceiro !== undefined ? d.id_parceiro === (i("prc") ? data.selection.prc : 0) : true) &&
        (d.id_consumo !== undefined ? d.id_consumo === (i("cns") ? data.selection.cns : 0) : true) &&
        (d.id_tipo !== undefined && i("tpo") ? d.id_tipo === data.selection.tpo : true) // Tipo não tem um "filtro total"
    );

    return d || null;
  };

  const displayValues = () => {
    if (!data) {
      return false;
    }

    // Se não há definição para esses valores, não mostre nada
    const tabs = desc[data.selection.eixo - 1][data.selection.num.toString()];
    const descriptions = tabs ? tabs[tab] : null;
    if (!descriptions || !descriptions[0] || typeof descriptions[0] !== "string") {
      return false;
    }

    let mainStr = "";
    let main: DataPoint | null = null;
    if (shouldDisplayDescription(eixo, num, tab + 1, 1, data.selection)) {
      if (descriptions[0] && typeof descriptions[0] === "string") {
        const rich = richString(descriptions[0], data.selection);
        mainStr = rich.string;
        main = findCorrectData(rich.used, data);
      } else if (descriptions[0] === "") {
        main = findSelectedData(data);
      }
    }

    let scndStr = "";
    let scnd: DataPoint | null = null;
    if (shouldDisplayDescription(eixo, num, tab + 1, 2, data.selection)) {
      if (descriptions[1] && typeof descriptions[1] === "string") {
        const rich = richString(descriptions[1], data.selection);
        scndStr = rich.string;
        scnd = findCorrectData(rich.used, data);
      } else if (descriptions[0] === "") {
        scnd = findSelectedData(data);
      }
    }

    let thrdStr = "";
    let thrd: DataPoint | null = null;
    if (shouldDisplayDescription(eixo, num, tab + 1, 3, data.selection)) {
      if (descriptions[2] && typeof descriptions[2] === "string") {
        const rich = richString(descriptions[2], data.selection);
        thrdStr = rich.string;
        thrd = findCorrectData(rich.used, data);
      } else if (descriptions[2] === "") {
        thrd = findSelectedData(data);
      }
    }

    return [
      main && (
        <Column key="0">
          <BigNumber style={{ color: config.primaryColor }}>{format(main.valor, main.formato)}</BigNumber>
          <BigNumberDesc>{mainStr}</BigNumberDesc>
        </Column>
      ),
      (scnd || thrd) && (
        <Row key="1">
          {scnd && (
            <Column>
              <BigNumber style={{ color: config.primaryColor }}>
                {format((main?.valor || 0) / scnd.valor, "percent")}
              </BigNumber>
              <BigNumberDesc>{scndStr}</BigNumberDesc>
            </Column>
          )}
          {thrd && (
            <Column>
              <BigNumber style={{ color: config.primaryColor }}>
                {format((main?.valor || 0) / thrd.valor, "percent")}
              </BigNumber>
              <BigNumberDesc>{thrdStr}</BigNumberDesc>
            </Column>
          )}
        </Row>
      )
    ];
  };

  if (!data || !data.data.length) {
    return <></>;
  }

  return (
    <>
      {tabs(data)}
      <Container>{displayValues()}</Container>
      <Source>Fonte: {data.data[0].fonte ? data.data[0].fonte : "Sem fonte"}</Source>
    </>
  );
};

export default DataInfo;
