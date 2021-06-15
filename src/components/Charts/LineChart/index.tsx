import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface IProps {
  data?: Data[];
}

interface Data {
  Ano: number;
  Valor: number;
  ID: number;
}

const LineChart: React.FC<IProps> = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const marginLeft = 30;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const svg = d3.select(d3Container.current);

      // Clear out the chart
      svg.selectAll("*").remove();

      const parseYear = (d: number) => d3.timeParse("%Y")(d.toString()) as Date;

      // Make the X axis
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => parseYear(d.Ano)) as [Date, Date])
        .rangeRound([0, width]);
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat((d) => (d as Date).getFullYear().toString())
        .tickSize(5)
        .tickPadding(5);
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft}, ${marginTop + height})`)
        .call(xAxis);

      // Make the y axis
      const values = data.map((d) => d.Valor);
      const yScale = d3.scaleLinear().rangeRound([height, 0]);
      yScale.domain(d3.extent(values) as [number, number]).nice();
      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d) => d.toString());
      svg.append("g").attr("transform", `translate(${marginLeft}, ${marginTop})`).call(yAxis);

      // Make the lines
      const uniqueIDs = new Set(data.map((d) => d.ID));
      uniqueIDs.forEach((id) => {
        const line = d3
          .line<Data>()
          .x((d) => xScale(parseYear(d.Ano)) as number)
          .y((d) => yScale(d.Valor));

        const path = svg
          .append("path")
          .datum(data.filter((d) => d.ID == id))
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("transform", `translate(${marginLeft}, ${marginTop})`)
          .attr("d", line);
      });
    }
  }, [data, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default LineChart;
