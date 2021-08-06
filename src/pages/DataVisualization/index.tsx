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
import { getScreenshot } from "services/api";
import { useSelection } from "hooks/SelectionContext";

const DataVisualization = () => {
  const { variableInfo, config } = useSelection();

  const handleDownload = (format) => {
    const getType = () => {
      if (format === "pdf") return "application/pdf";
      else if (format === "png") return "image/png";
    };

    getScreenshot(format).then((res) => {
      const blob = new Blob([res.data], { type: getType() });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `data.${format}`;
      link.click();
    });
  };

  return (
    <Page>
      <Breadcrumbs>
        <Container>
          <Title>{variableInfo.titulo}</Title>
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
            <Button style={{ backgroundColor: config.primaryColor }} onClick={() => handleDownload("png")}>
              PNG
            </Button>
            <Button style={{ backgroundColor: config.primaryColor }}>CSV</Button>
            <Button style={{ backgroundColor: config.primaryColor }} onClick={() => handleDownload("pdf")}>
              PDF
            </Button>
          </DownloadOptions>
        </Footer>
      </Breadcrumbs>
    </Page>
  );
};

export default DataVisualization;
