import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { useData } from "hooks/DataContext";
import SVGTooltip from "components/SVGTooltip";
import { useSelection } from "hooks/SelectionContext";
import { getTreemap } from "services/api";

interface IProps {
  data?: Data[];
}

interface Data {
  selectedGroup: number;
  entries: Entry[];
}

interface Entry {
  Value: number;
  Group: number;
  GroupName: string;
  GroupColor: string;
}

const DonutChart: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<Data | null>(null);
  const { colors } = useData();

  const { uf, prt, num, ano, cad, changeSelection } = useSelection();

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
      const { data } = await getTreemap(1, { var: num, uf, prt, ano });
      // TODO: Ler o eixo e escolher a função correta para parsear os dados
      setData({
        selectedGroup: cad,
        entries: parseEntries(data)
      });
    };

    getData();
  }, [uf, prt, num, ano, cad]);

  const parseEntries = (data): Entry[] =>
    data.map((d): Entry => {
      return {
        Value: d.Valor,
        Group: d.idCadeia,
        GroupName: d.CadeiaNome,
        GroupColor: colors["cadeias"][d.idCadeia.toString() as string]["color"]
      };
    });

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
        .sort((a, b) => b.Value - a.Value) // Ordenar as fatias pelo valor em ordem decrescente
        .value((d) => d.Value);
      const arcs = pie(data.entries);
      const arc = d3
        .arc<d3.PieArcDatum<Entry>>()
        .innerRadius(radius * (1 - thickness))
        .outerRadius(radius - selectThickness / 2);

      svg
        .selectAll("path.slice")
        .data(arcs)
        .join("path")
        .attr("transform", `translate(${margins.left + width / 2}, ${margins.top + height / 2})`)
        .attr("class", "slice")
        .style("cursor", "pointer")
        .on("click", (_, d) => {
          changeSelection("cad", d.data.Group);
        })
        .on("mouseover", (_, d) => {
          let [x, y] = arc.centroid(d);
          x += margins.left + width / 2;
          y += margins.top + height / 2;

          tooltip.setXY(x, y);
          tooltip.setText(`Valor: ${d.data.Value}\n` + `Grupo: ${d.data.GroupName}`);
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .transition()
        .duration(300)
        .attr("d", arc)
        .attr("stroke", "black")
        .attr("stroke-width", (d) => (d.data.Group === data.selectedGroup ? selectThickness : 0))
        .attr("fill", (d) => d.data.GroupColor);
    }
  }, [d3Container.current, data]);

  return <svg ref={d3Container} width="100%" height="100%" />;
};

export default DonutChart;
