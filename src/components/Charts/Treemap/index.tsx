import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { HierarchyNode, HierarchyRectangularNode } from "d3";

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

const Treemap: React.FC<IProps> = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  const parseData = (data): IParsedData => {
    console.log(data);

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
    if (data && d3Container.current) {
      const parsedData = parseData(data);
      const svg = d3.select(d3Container.current);

      const marginLeft = 0;
      const marginTop = 0;
      const marginBottom = 0;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const treemap = d3.treemap().tile(d3.treemapResquarify).size([width, height]).round(true).paddingInner(1);

      const root = d3
        .hierarchy(parsedData)
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

      const cell = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`) // TODO: descobrir a tipagem correta
        .style("cursor", "pointer");

      const rect = cell
        .append("rect")
        .attr("id", (d) => d.data.id || "")
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        .attr("fill", "red");

      rect.exit().remove();
    }
  }, [d3Container]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
  //
};

export default Treemap;
