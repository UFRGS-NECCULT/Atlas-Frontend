import React, { useEffect, useState } from "react";
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
import { getData } from "services/api";
// import BrazilMap from "components/Charts/BrazilMap";
// import BarChart from "components/Charts/BarChart";

const DataVisualization = () => {
  const [toggle, setToggle] = useState(true);
  const [data, setData] = useState<{ Ano: number; Valor: number }[]>([]);

  useEffect(() => {
    const initData = async () => {
      const data = await getData();
      console.log(data);
      setData(data);
    };

    initData();
  }, [toggle]);

  return (
    <Page>
      <Breadcrumbs />
      <button onClick={() => setToggle(!toggle)}>mudar</button>
      <Container>
        <Title>Oi</Title>
        <Viewboxes>
          <Box id={"box-1"} title="Mapa do Brasil">
            o
          </Box>
          <Box id={"box-2"} title="Dados">
            salve
          </Box>
          <Box id={"box-3"} title="Descrição da variável">
            <Text>
              A variável mostra o número total de empresas formais dos Setores Culturais e Criativos em operação no
              Brasil para o ano selecionado.
            </Text>
          </Box>
          <Box id={"box-4"} title="Série histórica">
            <ChartContainer>
              <BarChart data={data} />
              <ViewOptions>
                <button>x</button>
                <button>x</button>
              </ViewOptions>
            </ChartContainer>
          </Box>
          <Box id={"box-5"} title="Treemap - Setores Culturais Criativos">
            o
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
