import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  DownloadOptions,
  Footer,
  FooterTitle,
  Page,
  Title,
  Viewboxes,
  ChartContainer,
  ViewOptions
} from "./styles";
import Breadcrumbs from "components/Breadcrumbs";
import Box from "components/Box";
import BarChart from "components/Charts/BarChart";
import BrazilMap from "components/Charts/BrazilMap";
import Treemap from "components/Charts/Treemap";
import LineChart from "components/Charts/LineChart";
import DonutChart from "components/Charts/DonutChart";
import VarDescription from "components/Charts/VarDescription";
import DataInfo from "components/Charts/DataInfo";
import { Viewbox } from "./Viewbox";

type ChartType = "none" | "map" | "treemap" | "treemap_uf" | "line" | "bar" | "donut" | "world_map";

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

const DataVisualization = () => {
  const [stacked, setStacked] = useState<boolean>(false);

  const [viewBox1, setViewBox1] = useState<ViewCharts>({
    display: "none",
    charts: []
  });

  useEffect(() => {
    setViewBox1({
      display: "map",
      charts: [
        {
          id: "map",
          label: "Mapa",
          constants: {
            uf: 0
          }
        },
        {
          id: "treemap_uf",
          label: "Treemap"
        }
      ]
    });
  }, []);

  const getViewChart = (display: ChartType) => {
    if (!display) return getEmptyView();
    if (display === "map") return <BrazilMap />;

    return getEmptyView();
  };

  const getEmptyView = () => {
    return <h1>Sem vizualização</h1>;
  };

  const getViewButtons = ({ display, charts }: ViewCharts) => {
    console.log(display, charts);
    return charts.length > 1 && charts.map((chart) => chart.id);
  };

  return (
    <Page>
      <Breadcrumbs />
      <Container>
        <Title>NÚMERO TOTAL DE EMPRESAS</Title>
        <Viewboxes>
          <Box id={"box-1"} title="Mapa do Brasil">
            <Viewbox id={1} />
          </Box>
          <Box id={"box-2"} title="Dados">
            <DataInfo />
          </Box>
          <Box id={"box-3"} title="Descrição da variável">
            <VarDescription />
          </Box>
          <Box id={"box-4"} title="Série histórica">
            <ChartContainer>
              <Viewbox id={2} />
            </ChartContainer>
          </Box>
          <Box id={"box-5"} title="Treemap - Setores Culturais Criativos">
            <ChartContainer direction="row">
              <Viewbox id={3} />
            </ChartContainer>
          </Box>
        </Viewboxes>
      </Container>
      <Footer>
        <FooterTitle>Download</FooterTitle>
        <DownloadOptions>
          <Button>PDF</Button>
          <Button>PDF</Button>
          <Button>PDF</Button>
        </DownloadOptions>
      </Footer>
    </Page>
  );
};

export default DataVisualization;
