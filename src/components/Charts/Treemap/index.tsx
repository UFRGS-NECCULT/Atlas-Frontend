import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { getTreemap } from "services/api";
import Legend, { ILegendData } from "../Legend";
import { TreemapContainer } from "./styles";
import SVGTooltip from "components/SVGTooltip";
import { format } from "utils";

interface IParsedData {
  name: string;
  color: string;
  id?: string;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  children: {
    cadeiaId: number;
    color: string;
    name: string;
    children: {
      name: string;
      children: {
        color: string;
        cadeia_id: number;
        name: string;
        taxa: number;
        size: number;
      }[];
    }[];
  }[];
}

const Treemap: React.FC = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);
  const [data, setData] = useState<IParsedData>();
  const [dataFormat, setDataFormat] = useState("none");
  const [legendData, setLegendData] = useState<ILegendData[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  const unfocusOpacity = 0.8;

  const { uf, num, ano, cad, changeSelection } = useSelection();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getTreemap(1, { var: num, uf, ano });
      if (data.length) {
        setDataFormat(data[0].formato);
      }
      setData(parseData(data.filter((d) => d.valor !== 0)));
    };

    getData();
  }, [uf, num, ano]);

  const parseData = (data): IParsedData => {
    const legend: ILegendData[] = data.map((d) => {
      return { label: d.cadeia, color: d.cor, id: d.cadeia_id };
    });

    setLegendData(legend);

    const r = data.reduce((r, c) => {
      r.push({
        cadeiaId: c.cadeia_id,
        name: c.cadeia,
        color: c.cor,
        children: [
          {
            cadeiaId: c.cadeia_id,
            name: c.cadeia,
            color: c.cor,
            children: [
              {
                name: c.cadeia,
                id: c.cadeia_id,
                percentual: c.percentual,
                taxa: c.taxa,
                color: c.cor,
                size: Math.abs(c.valor)
              }
            ]
          }
        ]
      });

      return r;
    }, []);
    return { name: "scc", color: r.color, children: r };
  };

  useEffect(() => {
    const marginLeft = 0;
    const marginTop = 0;
    const marginBottom = 0;

    if (data && data.children && data.children.length && d3Container.current) {
      if (tooltipContainer.current == null) {
        tooltipContainer.current = new SVGTooltip(d3Container.current, {
          right: 0,
          left: marginLeft,
          top: marginTop,
          bottom: marginBottom
        });
      }
      const tooltip = tooltipContainer.current;

      const svg = d3.select(d3Container.current);

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
        .attr("opacity", (d) => (cad === 0 || cad === Number(d.data.id) ? 1 : unfocusOpacity))
        .attr("fill", (d) => d.data.color)
        .on("click", (d) => changeSelection("cad", Number(d.target.id)));

      g.append("foreignObject")
        .style("pointer-events", "none")
        .attr("class", "title-container")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", (d: any) => d.x1 - d.x0)
        .attr("height", (d: any) => d.y1 - d.y0)
        .append("xhtml:span")
        .attr("class", "title")
        .style("padding", "0.8em")
        .style("text-overflow", "ellipsis")
        .style("display", "inline-block")
        .style("overflow", "hidden")
        .style("width", "100%")
        .style("height", "100%")
        .style("font-size", "12px")
        .text((d: any) => {
          const height = d.y1 - d.y0;
          const width = d.x1 - d.x0;
          return height < 40 || width < 50 ? "" : d.data.name;
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
          return height < 20 || width < 40 ? "" : format(d.value, dataFormat);
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
        .style("opacity", (d) => (cad === 0 || cad === Number(d.data.id) ? 1 : unfocusOpacity))
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0); // TODO: descobrir a tipagem correta

      cell.select("span.title").text((d: any) => {
        const height = d.y1 - d.y0;
        const width = d.x1 - d.x0;
        return height < 40 || width < 50 ? "" : d.data.name;
      });
      cell
        .select("foreignObject.title-container")
        .attr("width", (d: any) => d.x1 - d.x0)
        .attr("height", (d: any) => d.y1 - d.y0);

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
          return height < 20 || width < 40 ? "" : format(d.value, dataFormat);
        });

      cell.exit().remove();

      svg.on("mousemove touchmove", (e) => {
        let [x, y] = d3.pointer(e);

        // Adjust to account for margins
        x -= marginLeft;
        y -= marginTop;

        // Tells if a point (x, y) is inside a rectangle that starts at (rx1, ry1) and ends at (rx2, ry2)
        const isInside = (x: number, y: number, rx1: number, ry1: number, rx2: number, ry2: number) =>
          x > rx1 && x < rx2 && y > ry1 && y < ry2;

        // Select the rectangle the mouse is on
        let selected: any = null;
        for (const data of root.leaves() as any[]) {
          // TODO: Find correct typing
          if (isInside(x, y, data.x0, data.y0, data.x1, data.y1)) {
            selected = data;
            break;
          }
        }

        // If we're not inside any rectangle, just hide the tooltip
        if (selected === null) {
          tooltip.hide();
          return;
        }

        const valor = format(selected.value, dataFormat);

        tooltip.setText(
          `Valor: ${valor}\n` +
          (selected.data.taxa > 0 ? `Taxa: ${selected.data.taxa}\n` : "") +
          `Percentual: ${(selected.data.percentual * 100).toFixed(2)}%\n` +
          `Cadeia: ${selected.data.name}`
        );
        tooltip.setXY(x, y);
        tooltip.show();
      });

      svg.on("touchend mouseleave", () => tooltip.hide());
    }
  }, [data, size, cad, d3Container]);

  return (
    <TreemapContainer>
      <svg ref={d3Container} width={"100%"} height={"100%"} />
      <Legend selector="cad" title="Setores" data={legendData} />
    </TreemapContainer>
  );
};

export default Treemap;
