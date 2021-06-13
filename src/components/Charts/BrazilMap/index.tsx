import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

import brStates from "../../../assets/json/br-min.json";
import { FeatureCollection } from "geojson";
import { GeometryCollection } from "topojson-specification";

interface IProps {
  data?: { Ano: number; Valor: number }[];
}

const BrazilMap = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const marginLeft = 30;
      const marginTop = 20;
      const marginBottom = 20;

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

      const map = svg
        .append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .style("fill", (d) => "gray")
        .attr("d", path)
        .attr("stroke-linecap", "round")
        .attr("stroke", "black")
        .style("cursor", "pointer");

      map.exit().transition().duration(300).remove();
    }
  }, [data, d3Container]);

  return <svg ref={d3Container} width={"100%"} height={"100%"} />;
};

export default BrazilMap;
