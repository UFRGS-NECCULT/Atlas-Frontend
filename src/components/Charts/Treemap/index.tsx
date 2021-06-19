import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { getTreemap } from "services/api";
import Legend from "./Legend";
import { TreemapContainer } from "./styles";

interface IProps {
  data?: {
    idCadeia: number;
    CadeiaNome: string;
    UFNome: string;
    Percentual: number;
    Taxa: number;
    Valor: number;
  }[];
}

interface IParsedData {
  name: string;
  id?: string;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  children: {
    cadeiaId: number;
    name: string;
    children: {
      name: string;
      children: {
        idCadeia: number;
        name: string;
        taxa: number;
        size: number;
      }[];
    }[];
  }[];
}

interface ILegendData {
  label: string;
  id: number;
  color: string;
}

const Treemap: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<IParsedData>();
  const [legendData, setLegendData] = useState<ILegendData[]>([]);

  const { uf, prt, num, ano, changeSelection } = useSelection();
  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getTreemap(1, { var: num, uf, prt, ano });
      setData(parseData(data));
    };

    getData();
  }, [uf, prt, num, ano]);

  const parseData = (data): IParsedData => {
    const legend: ILegendData[] = data.map((d) => {
      return { label: d.CadeiaNome, color: colors.cadeias[d.idCadeia].color };
    });

    setLegendData(legend);

    const r = data.reduce((r, c) => {
      r.push({
        cadeiaId: c.idCadeia,
        name: c.CadeiaNome,
        children: [
          {
            cadeiaId: c.idCadeia,
            name: c.CadeiaNome,
            children: [
              {
                name: c.CadeiaNome,
                id: c.idCadeia,
                percentual: c.Percentual,
                taxa: c.Taxa,
                size: c.Valor
              }
            ]
          }
        ]
      });

      return r;
    }, []);
    return { name: "scc", children: r };
  };

  useEffect(() => {
    if (data && data.children && data.children.length && d3Container.current) {
      const svg = d3.select(d3Container.current);

      const marginLeft = 0;
      const marginTop = 0;
      const marginBottom = 0;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const treemap = d3.treemap().tile(d3.treemapResquarify).size([width, height]).round(true).paddingInner(1);

      const fontScale = d3.scaleThreshold().domain([12, 25, 30, 40]).range([8, 12, 16, 20]);

      const root = d3
        .hierarchy(data)
        .sum((d: any) => {
          return d.size;
        })
        .sort(function (a, b) {
          return b.height - a.height;
        });

      treemap(root);

      const cell = svg.selectAll(".cell").data(root.leaves());

      const g = cell
        .enter()
        .append("g")
        .attr("class", "cell") // TODO: descobrir a tipagem correta
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`) // TODO: descobrir a tipagem correta
        .style("cursor", "pointer");

      g.append("rect")
        .attr("id", (d) => d.data.id || "")
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        // .attr("opacity", (d: any) => (cad === 0 || cad === d.data.id ? 1 : 0.5))
        .attr("opacity", (d: any) => 1)
        .attr("fill", (d) => colors.cadeias[d.data.id || 0].color)
        .on("click", (d) => changeSelection("cad", d.target.id));

      g.append("text")
        .attr("class", "title")
        .attr("x", 10)
        .attr("y", 19)
        .attr("text-anchor", "start")
        .attr("font-size", 12)
        .append("tspan")
        .text((d: any) => {
          const height = d.y1 - d.y0;
          const width = d.x1 - d.x0;
          return height < 50 || width < 80 ? "" : d.data.name;
        });

      g.append("text")
        .attr("class", "value")
        .attr("font-size", (d: any) => {
          const nodePercentageX = Math.round((100 * (d.x1 - d.x0)) / width);
          const nodePercentageY = Math.round((100 * (d.y1 - d.y0)) / height);
          return fontScale(nodePercentageX > nodePercentageY ? nodePercentageY : nodePercentageX);
        })
        .attr("x", (d: any) => d.x1 - d.x0 - 2)
        .attr("y", (d: any) => d.y1 - d.y0 - 2)
        .attr("dominant-baseline", "text-after-edge")
        .attr("text-anchor", "end")
        .text((d: any) => {
          const height = d.y1 - d.y0;
          const width = d.x1 - d.x0;
          return height < 20 || width < 40 ? "" : d.value;
        })
        .style("opacity", "1");

      cell
        .transition()
        .duration(300)
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`)
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        .select("rect")
        .attr("id", (d) => d.data.id || "")
        // .style("opacity", (d: any) => (cad === 0 || cad === d.data.id ? 1 : 0.5))
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0); // TODO: descobrir a tipagem correta

      cell.select("text.title").text((d: any) => {
        const height = d.y1 - d.y0;
        const width = d.x1 - d.x0;
        return height < 50 || width < 80 ? "" : d.data.name;
      });

      cell
        .select("text.value")
        .attr("font-size", (d: any) => {
          const nodePercentageX = Math.round((100 * (d.x1 - d.x0)) / width);
          const nodePercentageY = Math.round((100 * (d.y1 - d.y0)) / height);
          return fontScale(nodePercentageX > nodePercentageY ? nodePercentageY : nodePercentageX);
        })
        .attr("x", (d: any) => d.x1 - d.x0 - 2)
        .attr("y", (d: any) => d.y1 - d.y0 - 2)
        .attr("dominant-baseline", "text-after-edge")
        .attr("text-anchor", "end")
        .text((d: any) => {
          const height = d.y1 - d.y0;
          const width = d.x1 - d.x0;
          return height < 20 || width < 40 ? "" : d.value;
        });

      cell.exit().remove();
    }
  }, [data, d3Container]);

  return (
    <TreemapContainer>
      <svg ref={d3Container} width={"100%"} height={"100%"} />
      <Legend data={legendData} />
    </TreemapContainer>
  );
};

export default Treemap;
