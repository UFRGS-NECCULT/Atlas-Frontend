import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { getBars } from "services/api";
import { useData } from "hooks/DataContext";

interface Data {
  value: number;
  year: number;
}

const BarChart: React.FC = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  const [data, setData] = useState<Data[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  const { eixo, uf, cad, prt, num, ano, changeSelection } = useSelection();
  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getBars(1, { var: num, uf, cad, prt });
      parseBarsData(data);
    };

    getData();
  }, [uf, cad, prt, num]);

  const parseBarsData = (data) =>
    setData(
      data.map(
        (d): Data => ({
          year: d.Ano,
          value: d.Valor
        })
      )
    );

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const marginLeft = 50;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const svg = d3.select(d3Container.current);

      const years = data.map((d) => d.year.toString());
      const values = data.map((d) => d.value);

      const x = d3.scaleBand().domain(years).rangeRound([0, width]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(values) as [number, number])
        .rangeRound([height, 0]);

      y.domain(d3.extent(values) as [number, number]).nice();

      const gridLines = d3
        .axisLeft(y)
        .scale(y)
        .ticks(4)
        .tickSize(-width)
        .tickSizeOuter(0)
        .tickFormat(() => "");

      svg.selectAll(".grid").remove();
      svg
        .append("g")
        .attr("class", "grid")
        .style("opacity", 0.1)
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .call(gridLines);

      const xAxis = d3.axisBottom(x).tickSize(5).tickPadding(5);

      const yAxis = d3
        .axisLeft(y)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d) => d.toString());

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

      const selectColor = colors.eixo[eixo.toString()].color["2"];
      const groupColor = colors.cadeias[cad.toString()].color;

      svg
        .selectAll("rect")
        .data(data.map((d) => ({ ...d, selected: d.year === ano })))
        .join("rect")
        .on("click", (_, d) => {
          return changeSelection("ano", d.year);
        })
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .attr('stroke-width', 2)
        .style("cursor", "pointer")
        .transition()
        .duration(300)
        .attr("x", (d) => x(d.year.toString()) || 0)
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("opacity", (d) => (d.selected ? 1 : 0.65))
        .attr("fill", (d) => (d.selected ? selectColor : groupColor))
        .attr("stroke", (d) => (d.selected ? "#555" : "none"))
        .attr("opacity", (d) => (d.selected ? 0.65 : 1));
    }
  }, [ano, data, size, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BarChart;
