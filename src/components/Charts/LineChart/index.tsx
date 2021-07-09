import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import { useSelection } from "hooks/SelectionContext";
import { IColors, useData } from "hooks/DataContext";
import { getLines } from "services/api";
import SVGTooltip from "components/SVGTooltip";
import { format } from "utils";

interface IProps {
  data?: Data[];
}

interface Data {
  points: DataPoint[];
  format: string;
}

interface DataPoint {
  Ano: number;
  Valor: number;
  NomeGrupo: string;
}

function getColor(group: string, colors: IColors, eixo: number, deg: number, variable: number): string {
  switch (eixo) {
    case 0:
      if (variable >= 10) {
        // TODO: Receber cores do backend
        return "red";
      }
      return colors["cadeias"][group]["color"];
    case 1:
      if (deg === 0) {
        return colors["cadeias"][group]["color"];
      }
      return colors["deg"][deg.toString()]["subdeg"][group];
  }

  throw "Categoria de cores não encontrada!";
}

const LineChart: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<Data | null>(null);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  const { eixo, num, uf, cad, deg, prt } = useSelection();

  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getLines(eixo + 1, { var: num, uf, cad, prt, deg });
      setData({ points: data, format: "real" });
    };

    getData();
  }, [eixo, num, uf, cad, prt, deg]);

  useEffect(() => {
    const marginLeft = 40;
    const marginTop = 20;
    const marginBottom = 20;
    const marginRight = 15;

    if (data && data.points.length && d3Container.current) {
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

      // Remove previous axes
      svg.selectAll(".axis").remove();

      const parseYear = (d: number) => d3.timeParse("%Y")(d.toString()) as Date;

      // Make the X axis
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data.points, (d) => parseYear(d.Ano)) as [Date, Date])
        .rangeRound([0, width]);
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat((d) => (d as Date).getFullYear().toString())
        .tickSize(5)
        .tickPadding(5);
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${marginLeft}, ${marginTop + height})`)
        .call(xAxis);

      // Make the y axis
      const values = data.points.map((d) => d.Valor);
      const yScale = d3.scaleLinear().rangeRound([height, 0]);
      yScale.domain(d3.extent(values) as [number, number]).nice();
      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d) => format(d.valueOf(), data.format === "percent" ? "percent" : "si"));
      svg.append("g").attr("class", "axis").attr("transform", `translate(${marginLeft}, ${marginTop})`).call(yAxis);

      // Group each value based on their ID
      const groups: DataPoint[][] = [];
      outer: for (const d of data.points) {
        // Try to find a group with our id
        for (const group of groups) {
          if (group[0].NomeGrupo == d.NomeGrupo) {
            group.push(d);
            continue outer;
          }
        }
        // Found no group, create a new
        groups.push([d]);
      }
      // Build a line for each group
      const getXPos = (d: DataPoint) => xScale(parseYear(d.Ano)) as number;
      const getYPos = (d: DataPoint) => yScale(d.Valor);
      const line = d3.line<DataPoint>().x(getXPos).y(getYPos);
      const lines = svg.selectAll("path.line").data(groups);
      lines
        .join("path")
        .attr("class", "line")
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", (d) => getColor(d[0].NomeGrupo, colors, eixo, deg, num))
        .attr("stroke-width", 2)
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .attr("d", line);

      // Handle the tooltip
      const positions = data.points.map((d) => {
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

        const valor = format(d.Valor, data.format);

        tooltip.setText(`Valor: ${valor}\nAno: ${d.Ano}\nGrupo: ${d.NomeGrupo}`);
        tooltip.setXY(dx, dy);
        tooltip.show();
      });

      svg.on("touchend mouseleave", () => tooltip.hide());
    }
  }, [data, size, d3Container.current]);

  return <svg ref={d3Container} width="100%" height="100%" />;
};

export default LineChart;
