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
  Source
} from "./styles";
import Breadcrumbs from "components/Breadcrumbs";
import Box from "components/Box";
import VarDescription from "components/Charts/VarDescription";
import DataInfo from "components/Charts/DataInfo";
import { Viewbox } from "./Viewbox";
import { useSelection } from "hooks/SelectionContext";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const DataVisualization = () => {
  const { config } = useSelection();
  const [loading, setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (format: "png" | "pdf") => {
    setLoading(true);

    const saveElement = (el: HTMLElement) => {
      switch (format) {
        case "png":
          return downloadPNG(el);
        case "pdf":
          return downloadPDF(el);
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
                <Button style={{ backgroundColor: config.primaryColor }}>CSV</Button>
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

// Baixar a fonte padrão e converter pra base64
const downloadFont = async (base64 = true): Promise<string> => {
  const fontBlob = await fetch(process.env.PUBLIC_URL + "/fonts/Lato-Regular.ttf").then((r) => r.blob());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
      reject("Font não foi corretamente convertida para base64");
    };
    if (base64) {
      reader.readAsDataURL(fontBlob);
    } else {
      reader.readAsBinaryString(fontBlob);
    }
  });
};

const downloadPNG = async (element: HTMLElement): Promise<Blob> => {
  const fontBase64 = await downloadFont();

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

const downloadPDF = async (element: HTMLElement): Promise<Blob> => {
  // Tamanho de folha a4 em milímetros
  const jspdf = new jsPDF({
    format: [210, 297]
  });

  const fontBase64 = await downloadFont(false);
  jspdf.addFileToVFS("Lato-Regular-normal.ttf", fontBase64);
  jspdf.addFont("Lato-Regular-normal.ttf", "Lato Regular", "normal");

  return new Promise((resolve) => {
    jspdf.html(element, {
      callback: (doc) => {
        resolve(doc.output("blob"));
      },
      html2canvas: {
        // foreignObjectRendering: true,
      },
      width: 210,
      windowWidth: window.innerWidth,
      x: 0,
      y: 0
    });
  });
};

export default DataVisualization;
