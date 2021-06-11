import React from "react";
import { Button, Container, DownloadOptions, Footer, FooterTitle, Page, Title, Viewboxes } from "./styles";
import Breadcrumbs from "components/Breadcrumbs";
import Box from "components/Box";
import BrazilMap from "components/Charts/BrazilMap";
import BarChart from "components/Charts/BarChart";

const DataVisualization = () => {
  return (
    <Page>
      <Breadcrumbs />
      <Container>
        <Title>Oi</Title>
        <Viewboxes>
          <Box id={"box-1"}>o</Box>
          <Box id={"box-2"}>o</Box>
          <Box id={"box-3"}>o</Box>
          <Box id={"box-4"}>o</Box>
          <Box id={"box-5"}>o</Box>
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
