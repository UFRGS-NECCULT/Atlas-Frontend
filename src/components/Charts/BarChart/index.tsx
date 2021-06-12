import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface IProps {
  data?: { Ano: number; Valor: number }[];
}

const BarChart: React.FC<IProps> = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const marginLeft = 30;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const keys: string[] = data.map((d) => d.Ano.toString()); //TIRAR ESSA LOGICA DAQUI
      const values = data.map((d) => d.Valor); //TIRAR ESSA LOGICA DAQUI

      const svg = d3.select(d3Container.current);

      const x = d3.scaleBand().domain(keys).rangeRound([0, width]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(values) as [number, number])
        .rangeRound([height, 0]);

      y.domain(
        d3.extent(values, function (d) {
          return d;
        }) as [number, number]
      ).nice();

      const grid_lines = d3
        .axisLeft(y)
        .scale(y)
        .ticks(4)
        .tickSize(-width + marginLeft)
        .tickSizeOuter(0);
      // .tickFormat("");

      svg.selectAll(".grid").remove();
      svg
        .append("g")
        .attr("class", "grid")
        .style("opacity", 0.1)
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .call(grid_lines);

      const xAxis = d3
        .axisBottom(x)
        .tickFormat((d, i) => keys[i])
        .tickSize(5)
        .tickPadding(5);

      const yAxis = d3
        .axisLeft(y)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d, i) => {
          return d.toString();
        });

      svg.selectAll(".eixo-x").remove();
      svg.selectAll(".eixo-y").remove();

      svg
        .append("g")
        .attr("class", "eixo-x")
        .attr("transform", "translate(" + marginLeft + "," + (height + marginTop) + ")")
        .call(xAxis);
      svg
        .append("g")
        .attr("class", "eixo-y")
        .attr("transform", "translate(" + marginLeft + ", " + marginBottom + ")")
        .call(yAxis);

      const bars = svg.selectAll("rect").data(values);

      bars
        .transition()
        .duration(300)
        .attr("height", (d) => height - y(d))
        .attr("y", (d) => y(d));

      bars
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return x(keys[i]) || 0;
        })
        .attr("y", (d) => {
          return height;
        })
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .attr("width", x.bandwidth())
        .attr("height", (d) => 0)
        .attr("fill", "orange")
        .transition()
        .duration(300)
        .attr("height", (d) => height - y(d))
        .attr("y", (d) => y(d));

      bars
        .exit()
        .transition()
        .duration(300)
        .attr("y", (d) => height)
        .attr("height", 0)
        .remove();
    }
  }, [data, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BarChart;
