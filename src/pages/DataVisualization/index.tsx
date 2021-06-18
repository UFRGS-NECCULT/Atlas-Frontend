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
  Text,
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
import { useData } from "hooks/DataContext";

const DataVisualization = () => {
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
            <Text>
              A variável mostra o número total de empresas formais dos Setores Culturais e Criativos em operação no
              Brasil para o ano selecionado.
            </Text>
          </Box>
          <Box id={"box-4"} title="Série histórica">
            <ChartContainer>
              <BarChart />
              <ViewOptions>
                <button>x</button>
                <button>x</button>
              </ViewOptions>
            </ChartContainer>
          </Box>
          <Box id={"box-5"} title="Treemap - Setores Culturais Criativos">
            <ChartContainer direction="row">
              <Treemap />
              {/* <TreemapLegend /> */}
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
