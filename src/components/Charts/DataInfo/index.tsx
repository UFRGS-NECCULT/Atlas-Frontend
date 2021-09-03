import React, { useState, useEffect } from "react";
import { useSelection } from "hooks/SelectionContext";
import { IDescriptions, useData } from "hooks/DataContext";
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
    mec: number;
    pfj: number;
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

  // Valor que indica se um valor deve ser mostrado de maneira absoluta
  // ou como porcentagem do valor principal (padrão: porcentagem)
  display_absolute?: boolean;
}

interface ChartProps {
  constants?: {
    [key: string]: string | number;
  };
}

const DataInfo: React.FC<ChartProps> = ({ constants }) => {
  const { eixo, ano, num, cad, uf, deg, prc, cns, tpo, config } = { ...useSelection(), ...constants };
  // TODO: ocp, mec, pfj no useSelection()
  const ocp = 0;
  const mec = 0;
  const pfj = 0;
  const { desc } = useData();

  const [data, setData] = useState<Data | null>(null);

  let tab: 1 | 2 = 1;

  // Escolher aba correta
  if (eixo === 2 && ocp !== 0) {
    tab = 2;
  }

  useEffect(() => {
    const selectionClone = { eixo, ano, num, cad, uf, deg, ocp, prc, cns, tpo, mec, pfj, config };
    const getData = async () => {
      const { data } = await getInfo(selectionClone.eixo, { ...selectionClone, var: selectionClone.num });
      setData({ selection: selectionClone, data });
    };

    getData();
  }, [eixo, ano, num, cad, uf, deg, ocp, prc, cns, tpo, mec, pfj, config]);

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
        <TabButton className={tab === 1 ? "active" : ""} style={{ backgroundColor: config.primaryColor }}>
          {leftButtonText}
        </TabButton>
        <TabButton className={tab === 2 ? "active" : ""} style={{ backgroundColor: config.primaryColor }}>
          {rightButtonText}
        </TabButton>
      </Flex>
    );
  };

  const displayValues = (data: Data) => {
    // Pegar descrição e valor dos números
    const main = getValue(desc, tab, data, 1);
    const scnd = getValue(desc, tab, data, 2);
    const thrd = getValue(desc, tab, data, 3);

    return (
      main && [
        <Column key="0">
          <BigNumber style={{ color: config.primaryColor }}>{format(main.data.valor, main.data.formato)}</BigNumber>
          <BigNumberDesc>{main.string}</BigNumberDesc>
        </Column>,
        (scnd || thrd) && (
          <Row key="1">
            {scnd && (
              <Column>
                <BigNumber style={{ color: config.primaryColor }}>
                  {format(main.data.valor / scnd.data.valor, "percent")}
                </BigNumber>
                <BigNumberDesc>{scnd.string}</BigNumberDesc>
              </Column>
            )}
            {thrd && (
              <Column>
                <BigNumber style={{ color: config.primaryColor }}>
                  {format(main.data.valor / thrd.data.valor, "percent")}
                </BigNumber>
                <BigNumberDesc>{thrd.string}</BigNumberDesc>
              </Column>
            )}
          </Row>
        )
      ]
    );
  };

  if (!data || !data.data.length) {
    return <></>;
  }

  return (
    <>
      {tabs(data)}
      <Container>{displayValues(data)}</Container>
      <Source>Fonte: {data.data[0].fonte ? data.data[0].fonte : "Sem fonte"}</Source>
    </>
  );
};

export default DataInfo;

// Retorna o número e a descrição que deve ser mostrado no n-ésimo slot do datainfo
function getValue(desc: IDescriptions, tab: 1 | 2, data: Data, val: 1 | 2 | 3) {
  // Se não há definição para esses valores, não mostre nada
  const tabs = desc[data.selection.eixo - 1][data.selection.num.toString()];
  const descriptions = tabs ? tabs[tab - 1] : null;
  if (!descriptions || !descriptions[val - 1]) {
    return null;
  }

  if (shouldDisplayDescription(data.selection.eixo, data.selection.num, tab, val, data.selection)) {
    if (descriptions[val - 1] && typeof descriptions[0] === "string") {
      const rich = richString(descriptions[val - 1], data.selection);
      const valData = findCorrectData(rich.used, data);

      if (valData) {
        return {
          string: rich.string,
          data: valData
        };
      }
    } else if (descriptions[0] === "") {
      const valData = findSelectedData(data);

      if (valData) {
        return {
          data: valData,
          string: ""
        };
      }
    }
  }

  return null;
}

// Acha a entrada correta para um valor baseando-se nas expressões
// de substituição encontradas na string que descreve esse valor
function findCorrectData(filters: string[], data: Data) {
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
}

// Acha a entrada correta para um valor baseando-se na seleção
// de valores do breadcrumb
function findSelectedData(data: Data) {
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
}
