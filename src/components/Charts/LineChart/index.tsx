import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import debounce from "debounce";

import { useSelection } from "hooks/SelectionContext";
import { getLines } from "services/api";
import SVGTooltip from "components/SVGTooltip";
import { format } from "utils";

interface Data {
  ano: number;
  valor: number;
  percentual: number;
  taxa: number;
  grupo_id: number | null;
  grupo: string;
  cor: string;
  formato: string;
}
interface ChartProps {
  constants?: {
    [key: string]: string | number;
  };
}

const LineChart: React.FC<ChartProps> = ({ constants }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
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

  const { eixo, num, uf, cad, deg } = useSelection();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getLines(eixo, { var: num, uf, cad, deg, ...constants });
      setData(data);
    };

    getData();
  }, [eixo, num, uf, cad, deg]);

  useEffect(() => {
    const marginLeft = 50;
    const marginTop = 20;
    const marginBottom = 20;
    const marginRight = 15;

    if (data && data.length && d3Container.current) {
      if (tooltipContainer.current == null) {
        tooltipContainer.current = new SVGTooltip(d3Container.current, {
          right: marginRight,
          left: marginLeft,
          top: marginTop,
          bottom: marginBottom
        });
      }
      const tooltip = tooltipContainer.current;

      const width = d3Container.current.clientWidth - marginLeft - marginRight;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const svg = d3.select(d3Container.current);

      const dataFormat = data[0].formato;

      // Remove previous axes
      svg.selectAll(".axis").remove();

      const parseYear = (d: number) => d3.timeParse("%Y")(d.toString()) as Date;

      let step = 1;
      if (width < 280) {
        step = 2;
      }

      // Make the X axis
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => parseYear(d.ano)) as [Date, Date])
        .rangeRound([0, width]);
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat((d, i) => (i % step === 0 ? (d as Date).getFullYear().toString() : ""))
        .tickSize(5)
        .tickPadding(5);
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${marginLeft}, ${marginTop + height})`)
        .call(xAxis);

      // Make the y axis
      const values = data.map((d) => d.valor);
      const yScale = d3.scaleLinear().rangeRound([height, 0]);
      yScale.domain(d3.extent(values) as [number, number]).nice();
      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d) => format(d.valueOf(), dataFormat === "percent" ? "percent" : "si"));
      svg.append("g").attr("class", "axis").attr("transform", `translate(${marginLeft}, ${marginTop})`).call(yAxis);

      // Group each value based on their ID
      const groups: Data[][] = [];
      outer: for (const d of data) {
        // Try to find a group with our id
        for (const group of groups) {
          if (group[0].grupo == d.grupo) {
            group.push(d);
            continue outer;
          }
        }
        // Found no group, create a new
        groups.push([d]);
      }

      // Build a line for each group
      const getXPos = (d: Data) => xScale(parseYear(d.ano)) as number;
      const getYPos = (d: Data) => yScale(d.valor);
      const line = d3.line<Data>().x(getXPos).y(getYPos);
      const lines = svg.selectAll("path.line").data(groups);
      lines
        .join("path")
        .attr("class", "line")
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("opacity", (d) => (d[0].grupo_id ? (d[0].grupo_id === deg ? 1 : 0.4) : 1))
        .attr("stroke", (d) => d[0].cor)
        .attr("stroke-width", 2)
        .attr("d", line);

      // Handle the tooltip
      const positions = data.map((d) => {
        return { dx: getXPos(d), dy: getYPos(d), d };
      });

      svg.on("mousemove touchmove", (e) => {
        let [x, y] = d3.pointer(e);

        // Adjust to account for margins
        x -= marginLeft;
        y -= marginTop;

        // Shortcuts
        const sqrt = Math.sqrt;
        const sqr = (x: number) => Math.pow(x, 2);

        // Calculate the distance of the pointer to every data point and select the closest
        // https://en.wikipedia.org/wiki/Euclidean_distance#Two_dimensions
        const { dx, dy, d } = positions
          .map(({ dx, dy, d }) => {
            return { distance: sqrt(sqr(x - dx) + sqr(y - dy)), dx, dy, d };
          })
          .sort((a, b) => a.distance - b.distance)[0];

        const valor = format(d.valor, d.formato);

        tooltip.setText(`Valor: ${valor}\nAno: ${d.ano}\nGrupo: ${d.grupo}`);
        tooltip.setXY(dx, dy);
        tooltip.show();
      });

      svg.on("touchend mouseleave", () => tooltip.hide());
    }
  }, [data, size, d3Container.current]);

  return <svg ref={d3Container} width="100%" height="100%" />;
};

export default LineChart;
