import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { getBars } from "services/api";
import { useData } from "hooks/DataContext";
import SVGTooltip from "components/SVGTooltip";
import { format } from 'utils';

interface Data {
  bars: Bar[];
  format: string;
}

interface Bar {
  year: number;
  groups: {
    [groupID: string]: {
      name: string;
      id: number;
      value: number;
    };
  };
}

const BarChart: React.FC<{ stacked: boolean }> = ({ stacked }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<Data|null>(null);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  // TODO: ocp, subdeg
  const { eixo, deg, uf, cad, prt, num, ano, changeSelection } = useSelection();
  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getBars(eixo + 1, { var: num, uf, cad, prt, deg });
      const parsedData = parseBarsData(data);
      setData(parsedData);
    };

    getData();
  }, [eixo, deg, uf, cad, prt, num, stacked]);

  const parseBarsData = (data): Data => {
    // Agrupar desagregações por ano
    const groupsByYear = {};
    for (const item of data) {
      let group = item.IDGrupo;

      if (!stacked) {
        // Se foi selecionada uma cadeia e não estamos no modo stackado,
        // mostre somente a cadeia selecionada
        if (prt !== 0 && prt !== item.IDGrupo) {
          continue;
        }

        // Se não estamos no modo stackado, junte todos os dados em um só grupo
        group = prt.toString();
      }

      if (!(item.Ano in groupsByYear)) {
        groupsByYear[item.Ano] = {};
      }
      if (!(group in groupsByYear[item.Ano])) {
        // Esse código assume que agrupamentos de mesmo nome têm o mesmo ID
        groupsByYear[item.Ano][group] = {
          name: item.NomeGrupo,
          id: item.IDGrupo,
          value: 0
        };
      }

      groupsByYear[item.Ano][group].value += item.Valor;
    }

    // Transformar em um objeto adequado para o d3.stack()
    const result: Bar[] = [];
    for (const year in groupsByYear) {
      result.push({ year: Number(year), groups: groupsByYear[year] });
    }

    return {
      // TODO: Pegar formato do backend
      format: 'none',
      bars: result
    };
  };

  useEffect(() => {
    if (data && data.bars.length && d3Container.current) {
      const marginLeft = 35;
      const marginTop = 20;
      const marginBottom = 20;

      if (tooltipContainer.current == null) {
        tooltipContainer.current = new SVGTooltip(d3Container.current, {
          right: 0,
          left: marginLeft,
          top: marginTop,
          bottom: marginBottom
        });
      }
      const tooltip = tooltipContainer.current;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const svg = d3.select(d3Container.current);

      // Pegar todos os diferentes grupos de agregação
      const groups = Array.from(new Set(data.bars.flatMap((d) => Object.keys(d.groups).filter((k) => k !== "year"))));

      const stack = d3
        .stack<Bar>()
        .keys(groups)
        .value((d, k) => d.groups[k].value);
      const stackedData = stack(data.bars);

      const x = d3
        .scaleBand()
        .domain(data.bars.map((d) => d.year.toString()))
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
        .tickFormat((d) => format(d.valueOf(), "si"));

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

      svg
        .selectAll("g.bar-group")
        .data(stackedData)
        .join("g")
        .attr("class", "bar-group")
        .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")")
        .selectAll("rect")
        .data((d) =>
          d.map((o) => ({ ...o, group: o.data.groups[d.key], year: o.data.year, selected: o.data.year === ano }))
        )
        .join("rect")
        .on("click", (_, d) => {
          return changeSelection("ano", d.data.year);
        })
        .on("mouseenter", (_, d) => {
          tooltip.setText(`Valor: ${d.group.value}\nGrupo: ${d.group.name}`);
          tooltip.setXY((x(d.year.toString()) || 0) + x.bandwidth() / 2, y(d[0]) - (y(d[0]) - y(d[1])) / 2);
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .style("cursor", "pointer")
        .transition()
        .duration(300)
        // TODO: Receber cores do backend
        .attr("fill", (d) => stacked ? colors.deg['1']['subdeg'][d.group.name] : colors['cadeias'][d.group.id.toString()].color)
        .attr("x", (d) => x(d.data.year.toString()) || 0)
        .attr("y", (d) => Math.min(y(d[0]), y(d[1])))
        .attr("width", x.bandwidth())
        .attr("height", (d) => Math.abs(y(d[0]) - y(d[1])))
        .attr("opacity", (d) => (d.selected ? 1 : 0.65));
    }
  }, [ano, data, size, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BarChart;
