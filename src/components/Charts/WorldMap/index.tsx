import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import debounce from "debounce";

import worldMap from "../../../assets/json/world-110m.json";
import { GeometryCollection } from "topojson-specification";

import { World } from "./styles";
import { format } from "utils";
import { useSelection } from "hooks/SelectionContext";
import { getWorld } from "services/api";

interface ChartProps {
  constants?: {
    [key: string]: string | number;
  };
}

const WorldMap: React.FC<ChartProps> = ({ constants }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  const [data, setData] = useState<
    {
      cadeia: string;
      cadeia_id: number;
      uf: string;
      uf_id: number;
      parceiro: string;
      parceiro_id: number;
      consumo_id: number;
      tipo_id: number;
      cor: string;
      cor_eixo: string;
      cor_superior: string;
      cor_inferior: string;
      valor: number;
      percentual: number;
      taxa: number;
      formato: string;
    }[]
  >([]);

  const { eixo, uf, prc, tpo, cns, cad, ano, num, changeSelection } = useSelection();

  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener(
      "resize",
      debounce(() => setSize([window.innerWidth, window.innerHeight]), 100)
    );
  }, []);

  useEffect(() => {
    const getData = async () => {
      const { data } = await getWorld(eixo, { var: num, uf, cad, ano, cns, prc, tpo, ...constants });
      setData(data);
    };

    getData();
  }, [cad, ano, num, prc, cns, tpo]);

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg
        .append("defs")
        .attr("id", "defsgrad")
        .append("linearGradient")
        .attr("id", "grad")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "90%")
        .attr("y2", "100%");
    }
  }, [d3Container]);

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const dataFormat = data[0].formato;
      const marginLeft = 30;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const jsonFile = JSON.parse(JSON.stringify(worldMap));

      const svg = d3.select(d3Container.current);

      const projection = d3
        .geoMercator()
        .scale(250)
        .translate([width / 1.5, height / 1.2]);

      const path = d3.geoPath().projection(projection);

      const continents: GeoJSON.FeatureCollection = topojson.feature(
        jsonFile,
        jsonFile.objects.continent as GeometryCollection
      );

      const values = data.filter((d) => d.parceiro_id !== 0).map((d) => d.valor);
      const [minValue, maxValue] = d3.extent(values);
      const { cor_inferior, cor_superior } = data[0];

      const colorScale = d3
        .scaleLinear<string>()
        .domain(d3.extent(values) as [number, number])
        .range([cor_inferior, cor_superior]);

      d3.select("#grad")
        .selectAll("stop")
        .data([cor_inferior, cor_superior])
        .join("stop")
        .attr("class", (d, i) => (i === 0 ? "begin" : "end"))
        .attr("offset", (d, i) => (i === 0 ? "0%" : "90%"))
        .attr("stop-color", (d) => d)
        .style("stop-opacity", 1)
        .transition()
        .duration(300)
        .attr("stop-color", (d) => d);

      const legendPos = {
        x: width * 0.28,
        y: height + 10,
        height: height * 0.03,
        width: width * 0.5,
        rx: height / 200,
        ry: height / 200
      };

      svg.selectAll(".legenda").remove();
      const legenda = svg
        .append("g")
        .attr("class", "legenda")
        .append("rect")
        .attr("class", "legenda")
        .attr("x", legendPos.x)
        .attr("y", legendPos.y)
        .attr("height", legendPos.height)
        .attr("width", legendPos.width)
        .attr("rx", legendPos.rx)
        .attr("ry", legendPos.ry)
        .style("fill", "url(#grad)")
        .style("stroke-width", 1)
        .style("stroke", "black");
      legenda.exit().remove();

      const legendValues = [minValue, ((minValue || 0) + (maxValue || 0)) / 2, maxValue];

      svg
        .selectAll("line.lines-legenda")
        .data(legendValues)
        .join("line")
        .attr("class", "lines-legenda")
        .attr("x1", (d, i) => legendPos.x + i * (legendPos.width / 2))
        .attr("x2", (d, i) => legendPos.x + i * (legendPos.width / 2))
        .attr("y1", legendPos.y - 2)
        .attr("y2", legendPos.y + legendPos.height + 2)
        .style("stroke", "black")
        .style("stroke-width", 1);

      svg
        .selectAll("text.text-legenda")
        .data(legendValues)
        .join("text")
        .attr("x", (d, i) => legendPos.x + i * (legendPos.width / 2) - 8)
        .attr("y", legendPos.y + 25)
        .attr("class", "text-legenda")
        .attr("fill", "black")
        .style("font-size", "9px")
        .transition()
        .duration(800)
        .text((d) => format(d || 0, dataFormat === "percent" ? "percent" : "si"));

      projection.fitExtent(
        [
          [0, 0],
          [width, height]
        ],
        continents
      );

      const parsedContinents = continents.features.map((s) => {
        const d = data.find((x) => String(x.parceiro_id) === s.id);
        return { ...s, ...d, cor: colorScale(d?.valor || 0) };
      });

      svg
        .selectAll("path.country")
        .data(parsedContinents)
        .join("path")
        .attr("class", "country")
        .attr("id", (d) => Number(d.id) || 0)
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .style("cursor", "pointer")
        .on("click", (d) => changeSelection("prc", Number(d.target.id)))
        // .on("mousemove", showTooltip)
        // .on("mouseout", () => hideTooltip())
        .transition()
        .duration(800)
        .attr("d", path)
        .attr("fill", (d) => (d.id === String(prc) ? d.cor_eixo : d.cor) || `red`);
    }
  }, [d3Container, data, size, prc]);

  return <World ref={d3Container} width={"100%"} height={"100%"} />;
};

export default WorldMap;
