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
  ChartContainer
} from "./styles";
import Breadcrumbs from "components/Breadcrumbs";
import Box from "components/Box";
import VarDescription from "components/Charts/VarDescription";
import DataInfo from "components/Charts/DataInfo";
import { Viewbox } from "./Viewbox";
import { getScreenshotURL } from "services/api";

const DataVisualization = () => {
  return (
    <Page>
      <Breadcrumbs>
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
              <ChartContainer>
                <Viewbox id={3} />
              </ChartContainer>
            </Box>
          </Viewboxes>
        </Container>
        <Footer>
          <FooterTitle>Download</FooterTitle>
          <DownloadOptions>
            <Button
              onClick={async () => {
                window.open(getScreenshotURL("png"), "_blank");
              }}
            >
              PNG
            </Button>
            <Button>CSV</Button>
            <Button>PDF</Button>
          </DownloadOptions>
        </Footer>
      </Breadcrumbs>
    </Page>
  );
};

export default DataVisualization;
