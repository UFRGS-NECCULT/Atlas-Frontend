import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { getTreemap } from "services/api";

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
    colorId: number;
    name: string;
    children: {
      name: string;
      children: {
        name: string;
        estado: string;
        taxa: number;
        size: number;
      }[];
    }[];
  }[];
}

const Treemap: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<IParsedData>();

  const { uf, prt, num, ano } = useSelection();
  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getTreemap(1, { var: num, uf, prt, ano });

      console.log(data);
      const x = parseData(data);
      setData(x);
    };

    getData();
  }, [uf, prt, num, ano]);

  const parseData = (data): IParsedData => {
    const r = data.reduce((r, c) => {
      r.push({
        colorId: c.idCadeia,
        name: c.CadeiaNome,
        children: [
          {
            name: c.CadeiaNome,
            children: [
              {
                name: c.CadeiaNome,
                estado: c.UFNome,
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
    console.log(data);
    if (data && data.children && data.children.length && d3Container.current) {
      const svg = d3.select(d3Container.current);

      const marginLeft = 0;
      const marginTop = 0;
      const marginBottom = 0;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const treemap = d3.treemap().tile(d3.treemapResquarify).size([width, height]).round(true).paddingInner(1);

      // svg.selectAll("g").remove();

      const root = d3
        .hierarchy(data)
        .eachBefore((d, i) => {
          d.data.id = d.data.name;
        })
        .sum((d: any) => {
          return d.size;
        })
        .sort(function (a, b) {
          return b.height - a.height;
        });

      treemap(root);

      const cell = svg.selectAll(".cell").data(root.leaves());

      cell
        .enter()
        .append("g")
        .attr("class", "cell") // TODO: descobrir a tipagem correta
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`) // TODO: descobrir a tipagem correta
        .style("cursor", "pointer")
        .append("rect")
        .attr("id", (d) => d.data.id || "")
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        .attr("fill", (d) => colors.cadeias[d.data.id || 0].color);

      cell
        .transition()
        .duration(600)
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`)
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        .select("rect")
        .attr("id", (d) => d.data.id || "")
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0); // TODO: descobrir a tipagem correta
    }
  }, [data, d3Container]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default Treemap;
