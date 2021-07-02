import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { getBars } from "services/api";
import { useData } from "hooks/DataContext";

interface Data {
  year: number;
  [group: string]: number;
}

const BarChart: React.FC<{stacked: boolean}> = ({ stacked }) => {
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
      const parsedData = parseBarsData(data);
      setData(parsedData);
    };

    getData();
  }, [uf, cad, prt, num, stacked]);

  const parseBarsData = (data): Data[] => {
    // Agrupar desagregações por ano
    const groupsByYear = {};
    for (const item of data) {
      let groupName = item.NomeGrupo;

      if (!stacked) {
        // Se foi selecionada uma cadeia e não estamos no modo stackado,
        // mostre somente a cadeia selecionada
        if (cad !== 0 && cad !== item.IDGrupo) {
          continue;
        }

        // Se não estamos no modo stackado, junte todos os dados em um só grupo
        groupName = cad.toString();
      }

      if (!(item.Ano in groupsByYear)) {
        groupsByYear[item.Ano] = {};
      }
      if (!(groupName in groupsByYear[item.Ano])) {
        groupsByYear[item.Ano][groupName] = 0;
      }

      groupsByYear[item.Ano][groupName] += item.Valor;
    }

    // Transformar em um objeto adequado para o d3.stack()
    const result: Data[] = [];
    for (const year in groupsByYear) {
      result.push({ year: Number(year), ...groupsByYear[year] });
    }

    return result;
  };

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const marginLeft = 50;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const svg = d3.select(d3Container.current);

      // Pegar todos os diferentes grupos de agregação
      const groups = Array.from(new Set(data.flatMap((d) => Object.keys(d).filter((k) => k !== "year"))));

      const stack = d3.stack<Data>().keys(groups);
      const stackedData = stack(data);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.year.toString()))
        .rangeRound([0, width])
        .padding(0.1);

      const y = d3.scaleLinear().rangeRound([height, 0]);
      y.domain(d3.extent(stackedData.flatMap((d) => d.flatMap((d) => d))) as [number, number]).nice();

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
        .selectAll("g.bar-group")
        .data(stackedData)
        .join("g")
        .attr('class', 'bar-group')
        .attr('fill', d => colors.cadeias[d.key].color)
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .selectAll("rect")
        .data(d => d.map(d => ({...d, selected: d.data.year === ano})))
        .join("rect")
        .on("click", (_, d) => {
          return changeSelection("ano", d.data.year);
        })
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .transition()
        .duration(300)
        .attr("x", (d) => x(d.data.year.toString()) || 0)
        .attr("y", (d) => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("opacity", (d) => (d.selected ? 1 : 0.65));
    }
  }, [ano, data, size, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BarChart;
