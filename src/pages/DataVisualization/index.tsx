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
import BrazilMap from "components/Charts/BrazilMap";
import Treemap from "components/Charts/Treemap";
import TreemapLegend from "components/Charts/Treemap/Legend";
import LineChart from "components/Charts/LineChart";
// import BrazilMap from "components/Charts/BrazilMap";
// import BarChart from "components/Charts/BarChart";

const DataVisualization = () => {
  const [toggle, setToggle] = useState(true);
  const [data, setData] = useState<{ Ano: number; Valor: number; id: number }[]>([]);
  const [mapData] = useState<{ idUF: number; idRegiao: string; Valor: number }[]>([
    { idUF: 11, idRegiao: "Norte", Valor: 812 },
    { idUF: 12, idRegiao: "Norte", Valor: 215 },
    { idUF: 13, idRegiao: "Norte", Valor: 836 },
    { idUF: 14, idRegiao: "Norte", Valor: 201 },
    { idUF: 15, idRegiao: "Norte", Valor: 1469 },
    { idUF: 16, idRegiao: "Norte", Valor: 203 },
    { idUF: 17, idRegiao: "Norte", Valor: 452 },
    { idUF: 21, idRegiao: "Nordeste", Valor: 1182 },
    { idUF: 22, idRegiao: "Nordeste", Valor: 796 },
    { idUF: 23, idRegiao: "Nordeste", Valor: 2690 },
    { idUF: 24, idRegiao: "Nordeste", Valor: 1161 },
    { idUF: 25, idRegiao: "Nordeste", Valor: 1058 },
    { idUF: 26, idRegiao: "Nordeste", Valor: 2787 },
    { idUF: 27, idRegiao: "Nordeste", Valor: 784 },
    { idUF: 28, idRegiao: "Nordeste", Valor: 786 },
    { idUF: 29, idRegiao: "Nordeste", Valor: 4116 },
    { idUF: 31, idRegiao: "Sudoeste", Valor: 11767 },
    { idUF: 32, idRegiao: "Sudoeste", Valor: 2268 },
    { idUF: 33, idRegiao: "Sudoeste", Valor: 10080 },
    { idUF: 35, idRegiao: "Sudoeste", Valor: 32058 },
    { idUF: 41, idRegiao: "Sul", Valor: 8127 },
    { idUF: 42, idRegiao: "Sul", Valor: 5984 },
    { idUF: 43, idRegiao: "Sul", Valor: 8755 },
    { idUF: 50, idRegiao: "Centro-Oeste", Valor: 1389 },
    { idUF: 51, idRegiao: "Centro-Oeste", Valor: 1657 },
    { idUF: 52, idRegiao: "Centro-Oeste", Valor: 3390 },
    { idUF: 53, idRegiao: "Centro-Oeste", Valor: 2475 }
  ]);

  const [treemapData] = useState<
    {
      idCadeia: number;
      CadeiaNome: string;
      UFNome: string;
      Percentual: number;
      Taxa: number;
      Valor: number;
    }[]
  >([
    { idCadeia: 1, CadeiaNome: "Arquitetura e Design", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 37 },
    { idCadeia: 2, CadeiaNome: "Artes Cênicas e Espetáculos", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 6 },
    { idCadeia: 3, CadeiaNome: "Audiovisual", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 24 },
    { idCadeia: 4, CadeiaNome: "Cultura Digital", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 3 },
    { idCadeia: 5, CadeiaNome: "Editorial", UFNome: "Acre", Percentual: 0.001, Taxa: 0, Valor: 87 },
    { idCadeia: 6, CadeiaNome: "Educação e Criação em Artes", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 20 },
    { idCadeia: 7, CadeiaNome: "Entretenimento", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 11 },
    { idCadeia: 8, CadeiaNome: "Música", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 8 },
    { idCadeia: 9, CadeiaNome: "Patrimônio", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 2 },
    { idCadeia: 10, CadeiaNome: "Publicidade", UFNome: "Acre", Percentual: 0, Taxa: 0, Valor: 17 }
  ]);

  return (
    <Page>
      <Breadcrumbs />
      <Container>
        <Title>NÚMERO TOTAL DE EMPRESAS</Title>
        <Viewboxes>
          <Box id={"box-1"} title="Mapa do Brasil">
            <BrazilMap data={mapData} />
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
              <Treemap data={treemapData} />
              <TreemapLegend data={treemapData} />
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
