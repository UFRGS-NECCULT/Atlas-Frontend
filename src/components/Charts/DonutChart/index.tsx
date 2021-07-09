import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { useData } from "hooks/DataContext";
import SVGTooltip from "components/SVGTooltip";
import { useSelection } from "hooks/SelectionContext";
import { getDonut, getTreemap } from "services/api";
import { DonutChartContainer } from "./styles";
import Legend, { ILegendData } from "../Legend";

interface Data {
  valor: number;
  percentual: number;
  taxa: number;
  ano: number;
  cadeia_id: number;
  cor: string;
  cadeia: string;
}

const DonutChart: React.FC = () => {
  const d3Container = useRef<SVGSVGElement>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<Data[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  const { eixo, uf, deg, num, ano, cad, changeSelection } = useSelection();

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
      const { data } = await getDonut(eixo + 1, { var: num, uf, deg, ano });
      setData(data);
    };

    getData();
  }, [uf, deg, num, ano, cad, eixo]);

  const getSelector = (eixo) => {
    switch (eixo) {
      case 0:
        return "cad";
      default:
        throw `Eixo ${eixo + 1} não suportado pelo gráfico em donut!`;
    }
  };

  useEffect(() => {
    if (d3Container.current && data && data.length) {
      if (tooltipContainer.current == null) {
        tooltipContainer.current = new SVGTooltip(d3Container.current, margins);
      }
      const tooltip = tooltipContainer.current;

      const width = d3Container.current.clientWidth - margins.left;
      const height = d3Container.current.clientHeight - margins.top - margins.bottom;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(d3Container.current);

      const pie = d3
        .pie<Data>()
        .padAngle(0.015)
        .sort((a, b) => b.valor - a.valor) // Ordenar as fatias pelo valor em ordem decrescente
        .value((d) => Math.abs(d.valor));
      const arcs = pie(data);
      const arc = d3
        .arc<d3.PieArcDatum<Data>>()
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
          changeSelection("cad", d.data.cadeia_id);
        })
        .on("mouseover", (_, d) => {
          let [x, y] = arc.centroid(d);
          x += margins.left + width / 2;
          y += margins.top + height / 2;

          tooltip.setXY(x, y);
          tooltip.setText(`Valor: ${d.data.valor}\n` + `Grupo: ${d.data.cadeia}`);
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .transition()
        .duration(300)
        .attr("d", arc)
        .attr("stroke", "black")
        .attr("stroke-width", (d) => (d.data.cadeia_id === cad ? selectThickness : 0))
        .attr("fill", (d) => d.data.cor);
    }
  }, [d3Container.current, size, data]);

  const getLegend = (data: Data[]): ILegendData[] => {
    if (data == null) {
      return [];
    }

    return data.map((d: Data) => {
      return {
        label: d.cadeia,
        color: d.cor,
        id: d.cadeia_id
      };
    });
  };

  return (
    <DonutChartContainer>
      <svg ref={d3Container} width="100%" height="100%" />
      {/* <Legend selector={getSelector(eixo)} title="Setores" data={getLegend(data)}></Legend> */}
    </DonutChartContainer>
  );
};

export default DonutChart;
