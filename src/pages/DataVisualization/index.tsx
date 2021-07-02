import React from "react";
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
// import TreemapLegend from "components/Charts/Treemap/Legend";
import LineChart from "components/Charts/LineChart";
import DonutChart from "components/Charts/DonutChart";
import VarDescription from "components/Charts/VarDescription";
import { useState } from 'react';

const DataVisualization = () => {
  const [stacked, setStacked] = useState<boolean>(false);

  return (
    <Page>
      <Breadcrumbs />
      <Container>
        <Title>NÚMERO TOTAL DE EMPRESAS</Title>
        <Viewboxes>
          <Box id={"box-1"} title="Mapa do Brasil">
            <BrazilMap />
          </Box>
          <Box id={"box-2"} title="Dados">
            <ChartContainer>
              <LineChart />
            </ChartContainer>
          </Box>
          <Box id={"box-3"} title="Descrição da variável">
            <VarDescription />
          </Box>
          <Box id={"box-4"} title="Série histórica">
            <ChartContainer>
              <BarChart stacked={stacked} />
              <ViewOptions>
                <button onClick={() => setStacked(false)}>Agrupados</button>
                <button onClick={() => setStacked(true)}>Desagregados</button>
              </ViewOptions>
            </ChartContainer>
          </Box>
          <Box id={"box-5"} title="Treemap - Setores Culturais Criativos">
            <ChartContainer direction="row">
              <Treemap />
            </ChartContainer>
          </Box>
          <Box id="box-6" title="Donut - Setores Culturais Criativos">
          <ChartContainer direction="row">
            <DonutChart />
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
