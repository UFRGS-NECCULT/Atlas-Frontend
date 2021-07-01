import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { useData } from "hooks/DataContext";
import SVGTooltip from "components/SVGTooltip";
import { useSelection } from "hooks/SelectionContext";
import { getTreemap } from "services/api";
import { DonutChartContainer } from "./styles";
import Legend, { ILegendData } from "../Legend";

interface IProps {
  data?: Data[];
}

interface Data {
  selectedGroup: number;
  entries: Entry[];
}

interface Entry {
  value: number;
  group: number;
  groupName: string;
  groupColor: string;
  selectColor: string;
}

const DonutChart: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<Data | null>(null);
  const { colors } = useData();

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  const { eixo, uf, prt, num, ano, cad, changeSelection } = useSelection();

  // Valor entre (0, 1) para o quão grosso devem ser as fatias
  // em % do raio (1 = 100% do raio, 0 = 0% do raio)
  const thickness = 0.25;

  // Grossura do destaque selecionado
  const selectThickness = 2;

  const margins = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };

  useEffect(() => {
    const getData = async () => {
      // TODO: Pegar dados corretos do backend
      const { data } = await getTreemap(eixo + 1, { var: num, uf, prt, ano });

      switch (eixo) {
        case 0:
          setData({
            selectedGroup: cad,
            entries: parseEntries1(data)
          });
          break;
        default:
          throw `Eixo ${eixo + 1} não suportado pelo gráfico em donut!`;
      }
    };

    getData();
  }, [uf, prt, num, ano, cad, eixo]);

  const parseEntries1 = (data): Entry[] =>
    data.map((d): Entry => {
      return {
        value: d.Valor,
        group: d.IDGrupo,
        groupName: d.NomeGrupo,
        groupColor: colors["cadeias"][d.IDGrupo.toString() as string]["color"],
        selectColor: colors.eixo[0].color["2"]
      };
    });

  const getSelector = (eixo) => {
    switch (eixo) {
      case 0:
        return "cad";
      default:
        throw `Eixo ${eixo + 1} não suportado pelo gráfico em donut!`;
    }
  };

  useEffect(() => {
    if (d3Container.current && data && data.entries.length) {
      if (tooltipContainer.current == null) {
        tooltipContainer.current = new SVGTooltip(d3Container.current, margins);
      }
      const tooltip = tooltipContainer.current;

      const width = d3Container.current.clientWidth - margins.left;
      const height = d3Container.current.clientHeight - margins.top - margins.bottom;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(d3Container.current);

      const pie = d3
        .pie<Entry>()
        .padAngle(0.015)
        .sort((a, b) => b.value - a.value) // Ordenar as fatias pelo valor em ordem decrescente
        .value((d) => Math.abs(d.value));
      const arcs = pie(data.entries.filter((d) => d.value !== 0));
      const arc = d3
        .arc<d3.PieArcDatum<Entry>>()
        .innerRadius(radius * (1 - thickness))
        .outerRadius(radius - selectThickness / 2);

      svg
        .selectAll("path.slice")
        .data(arcs)
        .join("path")
        .attr("class", "slice")
        .attr("transform", `translate(${margins.left + width / 2}, ${margins.top + height / 2})`)
        .style("cursor", "pointer")
        .on("click", (_, d) => {
          changeSelection(getSelector(eixo), d.data.group);
        })
        .on("mouseover", (_, d) => {
          let [x, y] = arc.centroid(d);
          x += margins.left + width / 2;
          y += margins.top + height / 2;

          tooltip.setXY(x, y);
          tooltip.setText(`Valor: ${d.data.value}\n` + `Grupo: ${d.data.groupName}`);
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .transition()
        .duration(300)
        .attr("d", arc)
        .attr("stroke", "black")
        .attr("stroke-width", (d) => (d.data.group === data.selectedGroup ? selectThickness : 0))
        .attr("fill", (d) => (d.data.group === data.selectedGroup ? d.data.selectColor : d.data.groupColor));
    }
  }, [d3Container.current, size, data]);

  const getLegend = (data: Data | null): ILegendData[] => {
    if (data == null) {
      return [];
    }

    return data.entries.map((d: Entry) => {
      return {
        label: d.groupName,
        color: d.groupColor,
        id: d.group
      };
    });
  };

  return (
    <DonutChartContainer>
      <svg ref={d3Container} width="100%" height="100%" />
      <Legend selector={getSelector(eixo)} title="Setores" data={getLegend(data)}></Legend>
    </DonutChartContainer>
  );
};

export default DonutChart;
