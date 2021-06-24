import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import worldMap from "../../../assets/json/world-110m.json";
import SVGTooltip from "components/SVGTooltip";

import { VectorMap } from "react-jvectormap";

import "./styles.css";

const BrazilMap = () => {
  const d3Container = useRef<HTMLDivElement | null>(null);
  const tooltipContainer = useRef<SVGTooltip | null>(null);

  useEffect(() => {
    if (worldMap && d3Container.current) {
      const marginLeft = 30;
      const marginTop = 20;
      const marginBottom = 20;

      const width = d3Container.current.clientWidth - marginLeft;
      const height = d3Container.current.clientHeight - marginTop - marginBottom;

      const jsonFile = JSON.parse(JSON.stringify(worldMap));

      const svg = d3.select(d3Container.current);
      const paths = svg.selectAll("path").attr("fill", "blue");
    }
  }, [d3Container]);

  return (
    <div ref={d3Container} style={{ width: "100%", height: "100%" }}>
      <VectorMap
        map={"continents_mill"}
        backgroundColor="white"
        // ref={"map"}
        containerStyle={{
          width: "100%",
          height: "100%"
        }}
        containerClassName="map"
      />
    </div>
  );
};

export default BrazilMap;
