import BarChart from "components/Charts/BarChart";
import BrazilMap from "components/Charts/BrazilMap";
import DonutChart from "components/Charts/DonutChart";
import { EmptyChart } from "components/Charts/EmptyChart";
import LineChart from "components/Charts/LineChart";
import WorldMap from "components/Charts/WorldMap";
import Treemap from "components/Charts/Treemap";
import { useSelection } from "hooks/SelectionContext";
import React, { useEffect, useState } from "react";
import { getVisualization } from "services/api";
import { ChartButtons, ChartContainer, Container } from "./styles";

interface ViewboxProps {
  id: number;
}

type ChartType = "none" | "map" | "treemap_scc" | "treemap_uf" | "lines" | "bars" | "donut" | "world";

interface Chart {
  id: ChartType;
  label: string;
  constants?: {
    [key: string]: string | number;
  };
}

interface ViewCharts {
  display: ChartType;
  charts: Chart[];
}

const Chart: React.FC<{ chart?: Chart }> = ({ chart }) => {
  if (!chart) return <EmptyChart />;
  else if (chart.id === "world") return <WorldMap constants={chart.constants} />;
  else if (chart.id === "map") return <BrazilMap constants={chart.constants} />;
  else if (chart.id === "lines") return <LineChart constants={chart.constants} />;
  else if (chart.id === "treemap_scc") return <Treemap constants={chart.constants} />;
  else if (chart.id === "bars") return <BarChart stacked={false} constants={chart.constants} />;
  else if (chart.id === "donut") return <DonutChart constants={chart.constants} />;

  return <EmptyChart />;
};

export const Viewbox: React.FC<ViewboxProps> = ({ id }) => {
  const { num, eixo } = useSelection();
  const [chart, setChart] = useState<Chart>();
  const [viewBox, setViewBox] = useState<ViewCharts>({
    display: "none",
    charts: []
  });

  useEffect(() => {
    const { display } = viewBox;

    const chart = viewBox.charts.find((chart) => chart.id === display);
    if (chart) setChart(chart);
  }, [viewBox.display]);

  useEffect(() => {
    const getBoxInfo = async () => {
      const { data } = await getVisualization(eixo, { var: num, box: id });
      setViewBox(data);
    };
    getBoxInfo();
  }, [eixo, num]);

  const getViewButtons = ({ display, charts }: ViewCharts) => {
    return (
      charts.length > 1 &&
      charts.map((chart) => {
        return (
          <button key={chart.id} onClick={() => setViewBox({ ...viewBox, display: chart.id })}>
            {chart.label}
          </button>
        );
      })
    );
  };

  return (
    <Container>
      <ChartButtons>{getViewButtons(viewBox)}</ChartButtons>
      {/* <ChartContainer>{getViewChart()}</ChartContainer> */}
      <ChartContainer>
        <Chart chart={chart} />
      </ChartContainer>
    </Container>
  );
};
