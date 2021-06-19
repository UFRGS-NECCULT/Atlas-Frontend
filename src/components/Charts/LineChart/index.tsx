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

const LineChart: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  const data = [
    { Ano: 2007, Valor: 123, ID: 1 },
    { Ano: 2008, Valor: 231, ID: 1 },
    { Ano: 2009, Valor: 312, ID: 1 },
    { Ano: 2010, Valor: 420, ID: 1 },
    { Ano: 2011, Valor: 230, ID: 1 },
    { Ano: 2008, Valor: 149, ID: 2 },
    { Ano: 2009, Valor: 321, ID: 2 },
    { Ano: 2010, Valor: 650, ID: 2 },
    { Ano: 2011, Valor: 700, ID: 2 },
    { Ano: 2012, Valor: 630, ID: 2 },
    { Ano: 2013, Valor: 650, ID: 2 },
    { Ano: 2013, Valor: 650, ID: 2 },
    { Ano: 2013, Valor: 650, ID: 2 },
    { Ano: 2013, Valor: 650, ID: 2 },
    { Ano: 2009, Valor: 156, ID: 3 },
    { Ano: 2010, Valor: 162, ID: 3 },
    { Ano: 2011, Valor: 186, ID: 3 },
    { Ano: 2012, Valor: 195, ID: 3 },
    { Ano: 2013, Valor: 196, ID: 3 },
    { Ano: 2014, Valor: 215, ID: 3 },
    { Ano: 2015, Valor: 215, ID: 1 },
    { Ano: 2016, Valor: 198, ID: 1 }
  ];

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
      const palette = d3.scaleOrdinal(d3.schemeCategory10); // A color for each id
      uniqueIDs.forEach((id) => {
        const line = d3
          .line<Data>()
          .x((d) => xScale(parseYear(d.Ano)) as number)
          .y((d) => yScale(d.Valor));

        svg
          .append("path")
          .datum(data.filter((d) => d.ID == id))
          .attr("fill", "none")
          .attr("stroke", (d) => palette(id.toString()))
          .attr("stroke-width", 2)
          .attr("transform", `translate(${marginLeft}, ${marginTop})`)
          .attr("d", line);
      });
    }
  }, [data, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default LineChart;
