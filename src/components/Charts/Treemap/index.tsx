import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelection } from "hooks/SelectionContext";
import { useData } from "hooks/DataContext";
import { getTreemap } from "services/api";
import Legend, { ILegendData } from "../Legend";
import { TreemapContainer } from "./styles";
import SVGTooltip from "components/SVGTooltip";

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

const Treemap: React.FC<IProps> = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);
  const [data, setData] = useState<IParsedData>();
  const [legendData, setLegendData] = useState<ILegendData[]>([]);

  const unfocusOpacity = 0.8;

  const { uf, prt, num, ano, cad, changeSelection } = useSelection();
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
      return { label: d.CadeiaNome, color: colors.cadeias[d.idCadeia].color, id: d.idCadeia };
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
        .attr("fill", (d) => colors.cadeias[d.data.id || 0].color)
        .on("click", (d) => changeSelection("cad", Number(d.target.id)));

      g.append('foreignObject')
        .style('pointer-events', 'none')
        .attr('class', 'title-container')
        .attr('x', 0)
        .attr('y', 0)
        .attr("width", (d: any) => d.x1 - d.x0)
        .attr("height", (d: any) => d.y1 - d.y0)
        .append('xhtml:span')
        .attr('class', 'title')
        .style('padding', '0.8em')
        .style('text-overflow', 'ellipsis')
        .style('display', 'inline-block')
        .style('overflow-x', 'hidden')
        .style('width', '100%')
        .style('height', '100%')
        .style('font-size', '12px')
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
        .style("opacity", (d) => (cad === 0 || cad === Number(d.data.id) ? 1 : unfocusOpacity))
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0); // TODO: descobrir a tipagem correta

      cell.select("span.title")
        .text((d: any) => {
          const height = d.y1 - d.y0;
          const width = d.x1 - d.x0;
          return height < 40 || width < 50 ? "" : d.data.name;
        });
      cell.select("foreignObject.title-container")
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
          return height < 20 || width < 40 ? "" : d.value;
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

        tooltip.setText(
          `Valor: ${selected.value}\n` +
          (selected.data.taxa > 0 ? `Taxa: ${selected.data.taxa}\n` : "") +
          `Percentual: ${(selected.data.percentual * 100).toFixed(2)}%\n` +
          `Cadeia: ${selected.data.name}`
        );
        tooltip.setXY((selected.x0 + selected.x1) / 2, (selected.y0 + selected.y1) / 2); // Middle of the rectangle
        tooltip.show();
      });

      svg.on("touchend mouseleave", () => tooltip.hide());
    }
  }, [data, cad, d3Container]);

  return (
    <TreemapContainer>
      <svg ref={d3Container} width={"100%"} height={"100%"} />
      <Legend selector="cad" title="Setores" data={legendData} />
    </TreemapContainer>
  );
};

export default Treemap;
