import React, { useRef, useState } from "react";

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
  Loading,
  Source,
  CsvOption,
  Popover
} from "./styles";
import Breadcrumbs from "components/Breadcrumbs";
import Box from "components/Box";
import VarDescription from "components/Charts/VarDescription";
import DataInfo from "components/Charts/DataInfo";
import { Viewbox } from "./Viewbox";
import { getCsv, getCsvFiles } from "services/api";
import { useSelection } from "hooks/SelectionContext";
import html2canvas from "html2canvas";

interface ICsvFileOption {
  id: number;
  variable: number;
  label: string;
  file: string;
}

const DataVisualization = () => {
  const { config, eixo, num } = useSelection();
  const [loading, setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const referenceEl = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [csvFiles, setCsvFiles] = useState<ICsvFileOption[]>([]);

  const handleGetCsvFiles = () => {
    getCsvFiles({ ex: eixo, var: num }).then((res) => {
      setCsvFiles(res.data);
      setOpen(true);
    });
  };

  const handleDownloadCsv = (csv: ICsvFileOption) => {
    getCsv({ id: csv.id })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${csv.file}.xlsx`;

        link.click();
        setOpen(false);
      })
      .catch((e) => console.log(e));
  };

  const handleDownload = async (format) => {
    setLoading(true);

    const saveElement = (el: HTMLElement) => {
      switch (format) {
        case "png":
          return downloadPNG(el);
        case "pdf":
          // TODO: Implementar download de pdf
          throw new Error("Ainda não implementado!");
      }
    };

    if (contentRef.current) {
      try {
        const blob = await saveElement(contentRef.current);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `data.${format}`;
        link.click();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Page>
      <Breadcrumbs>
        <Container ref={contentRef}>
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
            {/* Essa div é usada para indicar a URL da página ao baixá-la como PNG/PDF */}
            <Source id="page-source" />
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
                <Button
                  style={{ backgroundColor: config.primaryColor }}
                  aria-describedby={`simple-popover`}
                  ref={referenceEl}
                  onClick={() => {
                    handleGetCsvFiles();
                  }}
                >
                  CSV
                </Button>
                <Popover
                  id={`simple-popover`}
                  open={open}
                  anchorEl={referenceEl.current}
                  onClose={() => setOpen(false)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                >
                  {csvFiles.map((file) => (
                    <CsvOption
                      key={file.id}
                      style={{ backgroundColor: config.primaryColor }}
                      onClick={() => handleDownloadCsv(file)}
                    >
                      {file.label}
                    </CsvOption>
                  ))}
                  <CsvOption style={{ backgroundColor: `red` }} onClick={() => setOpen(false)}>
                    Fechar
                  </CsvOption>
                </Popover>
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

const blobToBase64 = (blob: Blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const downloadPNG = async (element: HTMLElement): Promise<Blob> => {
  // Baixar a fonte padrão e converter pra base64
  const fontBlob = await fetch(process.env.PUBLIC_URL + "/fonts/Lato-Regular.ttf").then((r) => r.blob());
  const fontBase64 = await blobToBase64(fontBlob);

  // Calcular a posição Y do elemento
  const { top } = element.getBoundingClientRect();
  const topOffset = top + (window.pageYOffset || document.documentElement.scrollTop);

  const canvas = await html2canvas(element, {
    y: -topOffset,
    foreignObjectRendering: true,
    onclone: (clonedDocument) => {
      // Adicionar a fonte padrão em todos os SVGs
      const svgElemens = clonedDocument.getElementsByTagName("svg");
      for (let i = 0; i < svgElemens.length; i++) {
        const svg = svgElemens.item(i);
        if (svg) {
          const style = clonedDocument.createElement("style");
          style.append(`@font-face {
            font-family: 'Lato Regular';
            src: url("${fontBase64}");
          }`);
          svg.prepend(style);
        }
      }

      const srcDiv = clonedDocument.getElementById("page-source");
      if (srcDiv) {
        srcDiv.innerText = "Fonte: " + window.origin;
      }
    }
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject("canvas não foi corretamente convertido para blob");
      }
    });
  });
};

export default DataVisualization;
