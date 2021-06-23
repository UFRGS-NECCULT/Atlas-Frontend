import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { getBars } from "services/api";
import { useData } from "hooks/DataContext";

const BarChart: React.FC = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  const [keys, setKeys] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  const { eixo, uf, cad, prt, num, ano, changeSelection } = useSelection();
  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getBars(1, { var: num, uf, cad, prt });
      parseBarsData(data);
    };

    getData();
  }, [uf, cad, prt, num]);

  const parseBarsData = (data) => {
    const keys: string[] = data.map((d) => d.Ano.toString());
    const values = data.map((d) => d.Valor);

    setKeys(keys);
    setValues(values);
  };

  useEffect(() => {
    if (values && values.length && d3Container.current) {
      const marginLeft = 50;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

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
        .tickSize(-width)
        .tickSizeOuter(0)
        .tickFormat(() => "");

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
        .tickFormat((d, i) => d.toString());

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

      const findKeyByValue = (data) => {
        const index = values.findIndex((v) => v === data);
        return keys[index];
      };
      const bars = svg.selectAll("rect").data(values);

      bars
        .on("click", (e, d) => changeSelection("ano", Number(findKeyByValue(d))))
        .attr("class", (d) => (ano === Number(findKeyByValue(d)) ? "destacado" : "normal"))
        .transition()
        .duration(600)
        .attr("height", (d) => height - y(d))
        .attr("y", (d) => y(d));

      svg
        .selectAll(".normal")
        .attr("stroke", "none")
        .attr("opacity", 0.65)
        .attr("fill", colors.cadeias[cad.toString()].color);

      svg
        .selectAll(".destacado")
        .attr("stroke", "#555")
        .attr("opacity", 1)
        .attr("stroke-width", 2)
        .attr("fill", colors.eixo[eixo.toString()].color["2"]);

      bars
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return x(keys[i]) || 0;
        })
        .attr("y", (d) => height)
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .attr("width", x.bandwidth())
        .attr("height", (d) => 0)
        .style("cursor", "pointer")
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
  }, [ano, values, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BarChart;
