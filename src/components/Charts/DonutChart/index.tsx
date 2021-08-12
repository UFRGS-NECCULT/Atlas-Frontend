import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as debounce from "debounce";

import SVGTooltip from "components/SVGTooltip";
import { useSelection } from "hooks/SelectionContext";
import { getDonut } from "services/api";
import { DonutChartContainer } from "./styles";
import { format } from "utils";

interface Data {
  valor: number;
  percentual: number;
  taxa: number;
  ano: number;
  item_id: number;
  item_nome: string;
  cor: string;
  formato: string;
}

interface IProps {
  constants?: {
    [key: string]: string | number;
  };
}

const DonutChart: React.FC<IProps> = ({ constants }) => {
  const d3Container = useRef<SVGSVGElement>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<Data[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(() => setSize([window.innerWidth, window.innerHeight]), 100)
    );
  }, []);

  const { eixo, uf, deg, num, ano, cad, prc, cns, tpo, changeSelection } = useSelection();

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
      const { data } = await getDonut(eixo, { var: num, uf, deg, ano, prc, cns, tpo, cad, ...constants });
      setData(data);
    };

    getData();
  }, [uf, deg, num, ano, cad, prc, cns, tpo, eixo]);

  useEffect(() => {
    if (d3Container.current && data && data.length) {
      const dataFormat = data[0].formato;

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
        .sort(null)
        .value((d) => Math.abs(d.valor));
      const arcs = pie(data);
      const arc = d3
        .arc<d3.PieArcDatum<Data>>()
        .innerRadius(radius * (1 - thickness))
        .outerRadius(radius - selectThickness / 2);

      // Animação especial para as fatias do donut (o d3 não sabe animar tão bem elas)
      const tweenDonut = function (this, finish: any) {
        // Se for necessário, inicializar os dados da transição
        this._tweenPie = this._tweenPie || {
          startAngle: 0,
          endAngle: 0
        };

        // Construir uma animação que vai do ponto em que estamos até o ponto desejado
        const interpolator = d3.interpolate(this._tweenPie, finish);

        // Se lembrar em que ponto terminamos para
        // poder saber onde começar a próxima animação
        this._tweenPie = {
          startAngle: finish.startAngle,
          endAngle: finish.endAngle
        };

        return (d) => arc(interpolator(d));
      };

      svg
        .selectAll("path.slice")
        .data(arcs)
        .join("path")
        .attr("class", "slice")
        .attr("transform", `translate(${margins.left + width / 2}, ${margins.top + height / 2})`)
        .style("cursor", "pointer")
        .on(
          "click",
          debounce((_, d) => changeSelection("tpo", d.data.item_id), 250)
        )
        .on("mouseover", (_, d) => {
          let [x, y] = arc.centroid(d);
          x += margins.left + width / 2;
          y += margins.top + height / 2;

          const value = format(d.data.valor, dataFormat);

          tooltip.setXY(x, y);
          tooltip.setText(`Valor: ${value}\n` + `Tipo: ${d.data.item_nome}`);
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .transition()
        .duration(300)
        .attr("stroke", "black")
        .attr("stroke-width", (d) => (d.data.item_id === tpo ? selectThickness : 0))
        .attr("fill", (d) => d.data.cor)
        .attrTween("d", tweenDonut as any);
    }
  }, [d3Container.current, size, data]);

  return (
    <DonutChartContainer>
      <svg ref={d3Container} width="100%" height="100%" />
      {/* <Legend selector={getSelector(eixo)} title="Setores" data={getLegend(data)}></Legend> */}
    </DonutChartContainer>
  );
};

export default DonutChart;
