import React, { useState } from "react";

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
  Loading
} from "./styles";
import Breadcrumbs from "components/Breadcrumbs";
import Box from "components/Box";
import VarDescription from "components/Charts/VarDescription";
import DataInfo from "components/Charts/DataInfo";
import { Viewbox } from "./Viewbox";
import { getCsv, getScreenshot } from "services/api";
import { useSelection } from "hooks/SelectionContext";

const DataVisualization = () => {
  const { config, eixo, num } = useSelection();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDownloadCsv = () => {
    getCsv(eixo, { var: num })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `E${eixo}V${num}.xlsx`;
        link.click();
      })
      .catch((e) => console.log(e));
  };

  const handleDownload = (format) => {
    setLoading(true);

    const getType = () => {
      if (format === "pdf") return "application/pdf";
      else if (format === "png") return "image/png";
    };

    getScreenshot(format)
      .then((res) => {
        const blob = new Blob([res.data], { type: getType() });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `data.${format}`;
        link.click();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Page>
      <Breadcrumbs>
        <Container>
          <Title>{config.variable.titulo}</Title>
          <Viewboxes>
            <div className="row">
              <div className="col">
                <Box id="box-1" className="box expand" title="Mapa do Brasil">
                  <Viewbox id={1} />
                </Box>
                <Box id="box-3" className="box" title="Descrição da variável">
                  <VarDescription />
                </Box>
              </div>
              <div className="col">
                <Box id="box-2" className="box" title="Dados">
                  <DataInfo />
                </Box>
                <Box id="box-4" className="box expand" title="Série histórica">
                  <ChartContainer>
                    <Viewbox id={2} />
                  </ChartContainer>
                </Box>
              </div>
            </div>
            <div className="row">
              <Box id={"box-5"} title="Treemap - Setores Culturais Criativos">
                <ChartContainer>
                  <Viewbox id={3} />
                </ChartContainer>
              </Box>
            </div>
          </Viewboxes>
        </Container>
        <Footer id="footer">
          <FooterTitle>Download</FooterTitle>
          <DownloadOptions>
            {loading ? (
              <Loading />
            ) : (
              <>
                <Button style={{ backgroundColor: config.primaryColor }} onClick={() => handleDownload("png")}>
                  PNG
                </Button>
                <Button style={{ backgroundColor: config.primaryColor }} onClick={() => handleDownloadCsv()}>
                  CSV
                </Button>
                <Button style={{ backgroundColor: config.primaryColor }} onClick={() => handleDownload("pdf")}>
                  PDF
                </Button>
              </>
            )}
          </DownloadOptions>
        </Footer>
      </Breadcrumbs>
    </Page>
  );
};

export default DataVisualization;
