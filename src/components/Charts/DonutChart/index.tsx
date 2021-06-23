import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { useData } from "hooks/DataContext";
import SVGTooltip from "components/SVGTooltip";
import { useSelection } from 'hooks/SelectionContext';

interface IProps {
  data?: Data[];
}

interface Data {
  Valor: number;
  ID: number;
}

const DonutChart: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement>(null);
  const tooltipContainer = useRef<SVGTooltip|null>(null);

  const [data, setData] = useState<Data[]>([]);
  const { colors } = useData();

  const { cad, changeSelection } = useSelection();

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
        .sort((a, b) => b.Valor - a.Valor) // Ordenar as fatias pelo valor em ordem decrescente
        .value((d) => d.Valor);
      const arcs = pie(data);
      const arc = d3
        .arc<d3.PieArcDatum<Data>>()
        .innerRadius(radius * (1 - thickness))
        .outerRadius(radius - selectThickness / 2);

      svg
        .selectAll("path.slice")
        .data(arcs)
        .join("path")
        .attr("transform", `translate(${margins.left + width / 2}, ${margins.top + height / 2})`)
        .attr("class", "slice")
        .style('cursor', 'pointer')
        .on("click", (_, d) => {
          changeSelection("cad", d.data.ID);
        })
        .on("mouseover", (_, d) => {
          let [x, y] = arc.centroid(d);
          x += margins.left + width / 2;
          y += margins.top + height / 2;

          tooltip.setXY(x, y);
          tooltip.setText(
            `Valor: ${d.data.Valor}\n` +
            `Grupo: ${colors["cadeias"][d.data.ID.toString()]["name"]}`
          );
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .transition()
        .duration(300)
        .attr("d", arc)
        .attr('stroke', 'black')
        .attr('stroke-width', d => d.data.ID === cad ? selectThickness : 0)
        .attr("fill", (d) => colors["cadeias"][d.data.ID.toString()]["color"]);
    }
  }, [d3Container.current, data, cad]);

  useEffect(() => {
    // TODO: Fetch data from the server
    setData([
      { Valor: 3, ID: 1 },
      { Valor: 2, ID: 2 },
      { Valor: 1, ID: 3 },
      { Valor: 3, ID: 4 },
      { Valor: 2, ID: 5 }
    ]);
  }, []);

  return <svg ref={d3Container} width="100%" height="100%" />;
};

export default DonutChart;
