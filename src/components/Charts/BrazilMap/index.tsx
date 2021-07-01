import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import brStates from "../../../assets/json/br-min.json";
import { GeometryCollection } from "topojson-specification";
import { useSelection } from "hooks/SelectionContext";
import { getMap } from "services/api";
import { useData } from "hooks/DataContext";
import SVGTooltip from "components/SVGTooltip";

const BrazilMap = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  const [data, setData] = useState<{ uf: number; valor: number }[]>([]);

  // O tamanho da janela faz parte do nosso estado já que sempre
  // que a janela muda de tamanho, temos que redesenhar o svg
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerWidth, window.innerHeight]);
    });
  }, []);

  const { uf, cad, prt, ano, num, changeSelection } = useSelection();
  const { colors } = useData();

  useEffect(() => {
    const getData = async () => {
      const { data } = await getMap(1, { var: num, uf, cad, prt, ano });
      parseMapData(data);
    };

    getData();
  }, [cad, ano, num]);

  const parseMapData = (data) => {
    setData(data);
  };

  const getValueByUf = (uf: number) => {
    return data.find((x) => x.uf === uf)?.valor || 0;
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (data && data.length && d3Container.current) {
      const marginLeft = 30;
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

      const jsonFile = JSON.parse(JSON.stringify(brStates));

      const svg = d3.select(d3Container.current);

      const projection = d3
        .geoMercator()
        .scale(250)
        .translate([width / 1.5, height / 1.2]);

      const path = d3.geoPath().projection(projection);

      const states: GeoJSON.FeatureCollection = topojson.feature(
        jsonFile,
        jsonFile.objects.states as GeometryCollection
      );

      projection.fitExtent(
        [
          [0, 0],
          [width, height]
        ],
        states
      );

      const values = data.filter((d) => d.uf !== 0).map((d) => d.valor);

      const colorScale = d3
        .scaleLinear<string>()
        .domain(d3.extent(values) as [number, number])
        .range([colors.cadeias[cad].gradient["2"], colors.cadeias[cad].gradient["6"]]); // TODO: change color dinamicallly

      const [minValue, maxValue] = d3.extent(values);
      const [lowColor, highColor] = d3.extent(values).map((v) => colorScale(v));

      d3.select("#grad")
        .selectAll("stop")
        .data([lowColor, highColor])
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
        .text((d) => d || 0);

      const showTooltip = (e, d) => {
        let [x, y] = d3.pointer(e);
        // Adjust for margins
        x -= marginLeft;
        y -= marginTop;

        const name = d.properties.name
          .split(" ")
          .map((n) => n[0].toUpperCase() + n.slice(1).toLowerCase())
          .join(" ");

        tooltip.setXY(x, y);
        tooltip.setText(`Estado: ${name}\nValor: ${getValueByUf(Number(d.id))}`);
        tooltip.show();
      };
      const hideTooltip = () => {
        tooltip.hide();
      };

      const parsedStates = states.features.map((s) => {
        return { ...s, color: colorScale(getValueByUf(Number(s.id))) };
      });

      svg
        .selectAll("path.uf")
        .data(parsedStates)
        .join("path")
        .attr("class", "uf")
        .attr("id", (d) => Number(d.id) || 0)
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .style("cursor", "pointer")
        .on("click", (d) => changeSelection("uf", d.target.id))
        .on("mousemove", showTooltip)
        .on("mouseout", () => hideTooltip())
        .transition()
        .duration(800)
        .attr("d", path)
        .attr("fill", (d) => d.color);
    }
  }, [data, size, d3Container]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BrazilMap;
