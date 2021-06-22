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

      const stops = d3.select("#grad").selectAll("stop").data([lowColor, highColor]);

      stops
        .transition()
        .duration(300)
        .attr("stop-color", (d) => d);

      stops
        .enter()
        .append("stop")
        .attr("class", (d, i) => (i === 0 ? "begin" : "end"))
        .attr("offset", (d, i) => (i === 0 ? "0%" : "90%"))
        .attr("stop-color", (d) => d)
        .style("stop-opacity", 1);

      stops.exit().remove();

      const legend_pos = {
        x: width * 0.28,
        y: height + 10,
        height: height * 0.03,
        width: width * 0.5,
        rx: height / 200,
        ry: height / 200
      };

      svg.selectAll(".legenda").remove();
      // const legenda = svg.select(".legenda");

      const legenda = svg
        .append("g")
        .attr("class", "legenda")
        .append("rect")
        .attr("class", "legenda")
        .attr("x", legend_pos.x)
        .attr("y", legend_pos.y)
        .attr("height", legend_pos.height)
        .attr("width", legend_pos.width)
        .attr("rx", legend_pos.rx)
        .attr("ry", legend_pos.ry)
        .style("fill", "url(#grad)")
        .style("stroke-width", 1)
        .style("stroke", "black");

      legenda.exit().remove();

      const legend_values = [minValue, ((minValue || 0) + (maxValue || 0)) / 2, maxValue];

      const lines = svg.selectAll("line").data(legend_values);

      lines
        .enter()
        .append("line")
        .attr("class", "lines-legenda")
        .attr("x1", (d, i) => legend_pos.x + i * (legend_pos.width / 2))
        .attr("x2", (d, i) => legend_pos.x + i * (legend_pos.width / 2))
        .attr("y1", legend_pos.y - 2)
        .attr("y2", legend_pos.y + legend_pos.height + 2)
        .style("stroke", "black")
        .style("stroke-width", 1);

      lines.exit().remove();

      const legend_text = svg.selectAll("text").data(legend_values);

      legend_text.text((d) => d || 0);

      legend_text
        .enter()
        .append("text")
        .attr("class", ".text-legenda")
        .attr("x", (d, i) => legend_pos.x + i * (legend_pos.width / 2) - 8)
        .attr("y", legend_pos.y + 25)
        .attr("fill", "black")
        .style("font-size", "9px")
        .transition()
        .duration(800)
        .text((d) => d || 0);

      legend_text.exit().remove();

      const showTooltip = (d) => {
        let [x, y] = projection(d.mid)!;
        // Adjust for margins
        x -= marginLeft;
        y -= marginTop;

        tooltip.setXY(x, y);
        tooltip.setText(
          `Estado: ${d.properties.name[0].toUpperCase() + d.properties.name.slice(1).toLowerCase()}\n` +
          `Valor: ${getValueByUf(Number(d.id))}`
        );
        tooltip.show();
      };
      const hideTooltip = () => {
        tooltip.hide();
      };

      /* Mapa */
      // TODO: Find correct typing
      const parsedStates = states.features.map((s: any) => {
        // Compute mid point (just the average of all points)
        let midx = 0;
        let midy = 0;
        let coords = [];
        switch (s.geometry.type) {
          case "MultiPolygon":
            coords = s.geometry.coordinates[0][0];
            break;
          case "Polygon":
            coords = s.geometry.coordinates[0];
            break;
          default:
            throw `Unknown geometry type "${s.geometry.type}"`;
        }
        for (const [x, y] of coords) {
          midx += x;
          midy += y;
        }
        midx /= coords.length;
        midy /= coords.length;

        return { ...s, mid: [midx, midy], color: colorScale(getValueByUf(Number(s.id))) };
      });

      const map = svg
        .selectAll("path.uf")
        .on("mouseover", (_, d) => showTooltip(d))
        .on("mouseout", () => hideTooltip())
        .data(parsedStates);

      map
        .enter()
        .append("path")
        .attr("class", "uf")
        .attr("d", path)
        .attr("id", (d) => Number(d.id) || 0)
        .on("click", (d) => changeSelection("uf", d.target.id))
        .attr("stroke-linecap", "round")
        .attr("fill", (d) => d.color)
        .attr("stroke", "black")
        .style("cursor", "pointer");

      map
        .transition()
        .duration(300)
        .attr("fill", (d) => d.color);

      map.exit().transition().duration(300).remove();
    }
  }, [data, d3Container]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BrazilMap;
