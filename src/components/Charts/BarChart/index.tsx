import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { getBars } from "services/api";
import SVGTooltip from "components/SVGTooltip";
import { format } from "utils";

interface RawData {
  ano: number;
  valor: number;
  cor: string;
  cor_eixo: any;
  sdg_nome: string;
  sdg_cor: string;
  formato: string;
}

interface ParsedData {
  year: number;
  [deg: string]: number;
}

interface BarChartProps {
  stacked: boolean;
  constants?: {
    [key: string]: string | number;
  };
}

const BarChart: React.FC<BarChartProps> = ({ stacked, constants }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [rawData, setRawData] = useState<RawData[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  // TODO: ocp, subdeg
  const { eixo, deg, uf, cad, num, ano, changeSelection } = useSelection();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getBars(eixo, { var: num, uf, cad, deg, ...constants });
      setRawData(data);
    };

    getData();
  }, [eixo, deg, uf, cad, num, stacked]);

  const parseBarsData = (data): ParsedData[] => {
    const groupedData = data.reduce((r, c) => {
      const index = r.findIndex((d) => d.ano === c.ano);

      if (index >= 0) {
        r[index].dados.push(c);
      } else {
        r.push({
          ano: c.ano,
          dados: [c]
        });
      }

      return r;
    }, []);

    const parsedData = groupedData.map((bar) => {
      const obj = { ano: bar.ano };

      bar.dados.forEach((deg) => {
        obj[deg.sdg_nome || "Total"] = deg.valor;
      });

      return obj;
    });

    return parsedData;
  };

  useEffect(() => {
    if (rawData && rawData.length && d3Container.current) {
      const data = parseBarsData(rawData);
      const dataFormat = rawData[0].formato;

      const marginLeft = 50;
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
      const groups = Array.from(new Set(data.flatMap((d) => Object.keys(d).filter((k) => k !== "ano"))));

      const stack = d3.stack<ParsedData>().keys(groups);
      const stackedData = stack(data);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.ano.toString()))
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

      let step = 1;
      if (width < 320) {
        step = 2;
      }

      const xAxis = d3
        .axisBottom(x)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d, i) => (i % step === 0 ? d : ""));

      const yAxis = d3
        .axisLeft(y)
        .tickSize(5)
        .tickPadding(5)
        .tickFormat((d) => format(d.valueOf(), dataFormat === "percent" ? "percent" : "si"));

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
        .data((d) => {
          const bar = d.map((barSection) => {
            const data = rawData.find(
              (r) => r.ano === barSection.data.ano && r.sdg_nome === d.key
              // ||  (r.ano === barSection.data.ano && d.key === "Total")
            );
            return {
              ...barSection,
              selected: barSection.data.ano === ano,
              dados: { ...data },
              data: { ...barSection.data }
            };
          });

          return bar;
        })
        .join("rect")
        .on("click", (_, d) => {
          return changeSelection("ano", d.data.ano);
        })
        .on("mouseenter", (_, d) => {
          const valor = format(d.dados.valor || 0, dataFormat);

          tooltip.setText(`Valor: ${valor}\nGrupo: ${d.dados.sdg_nome}`);
          tooltip.setXY(
            (x(d.dados.ano?.toString() || `2016`) || 0) + x.bandwidth() / 2,
            y(d[0]) - (y(d[0]) - y(d[1])) / 2
          );
          tooltip.show();
        })
        .on("mouseleave", () => tooltip.hide())
        .style("cursor", "pointer")
        .attr("fill", (d) => (d.selected ? d.dados.cor_eixo || "red" : d.dados.sdg_cor || d.dados.cor))
        .transition()
        .duration(300)
        .attr("x", (d) => x(d.data.ano.toString()) || 0)
        .attr("y", (d) => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", (d) => Math.abs(y(d[0]) - y(d[1])))
        .attr("opacity", (d) => (d.selected ? 1 : 0.65));
    }
  }, [ano, rawData, size, d3Container.current]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BarChart;
