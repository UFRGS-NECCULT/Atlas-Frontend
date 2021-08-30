/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as debounce from "debounce";
import { useSelection } from "hooks/SelectionContext";
import { getTreemapCad, getTreemapUF } from "services/api";
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
    grupoID: number;
    color: string;
    name: string;
    children: {
      name: string;
      children: {
        color: string;
        grupo_id: number;
        name: string;
        taxa: number;
        size: number;
      }[];
    }[];
  }[];
}

interface ChartProps {
  constants?: {
    [key: string]: string | number;
  };
  group: "uf" | "scc";
}

const scaleFont = (d: any, i, g) => {
  const el = d3.select(g[i]);

  const width = d.x1 - d.x0;
  const padding = 8;

  let textLength = el.node()?.getComputedTextLength() || 0;
  let fontSize = Number(el.attr("font-size"));
  while (textLength > width - 2 * padding && fontSize > 0) {
    fontSize -= 1;
    el.attr("font-size", fontSize);
    textLength = el.node()?.getComputedTextLength() || 0;
  }

  // Se a fonte estiver muito pequena, nem mostre
  if (fontSize < 10) {
    el.attr("font-size", 0);
  }
};

const Treemap: React.FC<ChartProps> = ({ constants, group }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);
  const [data, setData] = useState<IParsedData>();
  const [dataFormat, setDataFormat] = useState("none");
  const [legendData, setLegendData] = useState<ILegendData[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);

  const debouncedResize = useCallback(
    debounce(() => setSize([window.innerWidth, window.innerHeight]), 100),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);


  const unfocusOpacity = 0.8;

  const { eixo, uf, num, ano, cad, tpo, prc, cns, deg, changeSelection } = useSelection();

  const endpoints = {
    scc: getTreemapCad,
    uf: getTreemapUF
  };
  const selectors = {
    scc: "cad",
    uf: "uf"
  };
  const legendSelectors = {
    scc: "cad",
    uf: undefined // No treemap-uf a legenda mostra as regiões, que não são clicáveis
  };
  const selectorValues = {
    scc: cad,
    uf: uf
  };
  const legendTitles = {
    scc: "Setores",
    uf: "Regiões"
  };

  const selector = selectors[group];

  useEffect(() => {
    const getData = async () => {
      const endpoint = endpoints[group];

      const { data } = await endpoint(eixo, { var: num, uf, cad, ano, tpo, prc, cns, deg, ...constants });
      if (data.length) {
        setDataFormat(data[0].formato);
      }
      setData(parseData(data.filter((d) => d.valor !== 0)));
    };

    getData();
  }, [eixo, uf, num, ano, cad, tpo, prc, cns, deg, group]);

  const parseData = (data): IParsedData => {
    const groups = {};
    for (const d of data) {
      // Inicializar grupo
      if (!groups[d.grupo_id]) {
        groups[d.grupo_id] = {
          grupoID: d.grupo_id,
          name: d.grupo_nome,
          color: d.cor,
          children: [
            {
              grupoID: d.grupo_id,
              name: d.grupo_nome,
              color: d.cor,
              children: []
            }
          ]
        };
      }

      groups[d.grupo_id].children[0].children.push({
        name: d.item_nome,
        id: d.item_id,
        percentual: d.percentual,
        taxa: d.taxa,
        color: d.cor,
        size: Math.abs(d.valor)
      });
    }

    const groupsArray = Object.keys(groups).map((k) => groups[k]);

    const legend: ILegendData[] = groupsArray.map((g) => ({ label: g.name, color: g.color, id: g.grupoID }));
    setLegendData(legend);

    return { name: "scc", color: "#ff0000", children: groupsArray };
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
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`); // TODO: descobrir a tipagem correta

      const rects = g
        .append("rect")
        .attr("id", (d) => d.data.id || "")
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        .attr("opacity", (d) => (cad === 0 || cad === Number(d.data.id) ? 1 : unfocusOpacity))
        .attr("fill", (d) => d.data.color);

      g.append("foreignObject")
        .style("pointer-events", "none")
        .attr("class", "title-container")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", (d: any) => {
          const width = d.x1 - d.x0
          return width > 0 ? width : 0;
        })
        .attr("height", (d: any) => {
          const height = d.y1 - d.y0 - 20
          return height > 0 ? height : 0
        })
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
        .style("opacity", "1")
        .each(scaleFont);

      const transition = cell.transition().duration(300);

      transition
        .attr("transform", (d: any) => `translate(${d.x0}, ${d.y0})`)
        .attr("width", (d: any) => d.x1 - d.x0) // TODO: descobrir a tipagem correta
        .attr("height", (d: any) => d.y1 - d.y0) // TODO: descobrir a tipagem correta
        .select("rect")
        .attr("id", (d) => d.data.id || "")
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
        })
        .each(scaleFont);

      if (selector) {
        const val = selectorValues[group];

        rects.style("cursor", "pointer").on(
          "click",
          debounce((d) => changeSelection(selector, Number(d.target.id)), 250)
        );

        transition.style("opacity", (d) => (val === 0 || val === Number(d.data.id) ? 1 : unfocusOpacity));
      }

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
          `Grupo: ${selected.data.name}`
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
      <Legend selector={legendSelectors[group]} title={legendTitles[group]} data={legendData} />
    </TreemapContainer>
  );
};

export default Treemap;
