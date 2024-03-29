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
import { jsPDF } from "jspdf";

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

  //   const handleDownloadSQL = () => {
  //     getSQL()
  //       .then((res) => {
  //         const blob = new Blob([res.data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //         });
  //         const link = document.createElement("a");
  //         link.href = window.URL.createObjectURL(blob);
  //         link.download = `ATLAS.sql`;

  //         link.click();
  //       })
  //       .catch((e) => console.log(e));
  //   };

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
                <Box id="box-1" className="box expand">
                  <Viewbox id={1} />
                </Box>
                <Box id="box-3" className="box">
                  <VarDescription />
                </Box>
              </div>
              <div className="col">
                <Box id="box-2" className="box">
                  <DataInfo />
                </Box>
                <Box id="box-4" className="box expand">
                  <ChartContainer>
                    <Viewbox id={2} />
                  </ChartContainer>
                </Box>
              </div>
            </div>
            <div className="row">
              <Box id={"box-5"}>
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
                  {/* <Button style={{ backgroundColor: config.primaryColor }} onClick={() => handleDownloadSQL()}> */}
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

// Baixar a fonte padrão como base64 e binaryString
const downloadFont = async (): Promise<[string, string]> => {
  const fontBlob = await fetch(process.env.PUBLIC_URL + "/fonts/Lato-Regular.ttf").then((r) => r.blob());
  const base64 = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
      reject("Font não foi corretamente convertida para base64");
    };
    reader.readAsDataURL(fontBlob);
  });
  const binaryString = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      }
      reject("Font não foi corretamente convertida para binaryString");
    };
    reader.readAsBinaryString(fontBlob);
  });

  return Promise.all([base64, binaryString]);
};

// Embarca a fonte dentro dos svgs de um elemento
const prepareSVGs = (document: Document, element: HTMLElement, fontBase64: string) => {
  const svgElemens = element.getElementsByTagName("svg");
  for (let i = 0; i < svgElemens.length; i++) {
    const svg = svgElemens.item(i);
    if (svg) {
      const style = document.createElement("style");
      style.append(`@font-face {
        font-family: 'Lato Regular';
        src: url("${fontBase64}");
      }`);
      svg.prepend(style);
    }
  }
};

// Ajusta o tamanho da fonte da descrição da variável
const prepareDescription = (document: Document) => {
  const varDescEl = document.getElementById("var-description");
  const varDescContainer = document.getElementById("box-3");
  if (varDescEl && varDescContainer) {
    // Calcular a altura interior do container
    const style = getComputedStyle(varDescContainer);
    const height = varDescContainer.clientHeight - (parseInt(style.paddingTop) + parseInt(style.paddingBottom));

    // Enquanto o texto for mais alto que container, diminua a fonte
    const fontSizes = ["small", "smaller", "x-small", "xx-smal"];
    let i = 0;
    while (varDescEl.clientHeight > height && i < fontSizes.length) {
      varDescEl.style.fontSize = fontSizes[i];
      i += 1;
    }
  }
};

const downloadPNG = async (element: HTMLElement): Promise<Blob> => {
  const [fontBase64] = await downloadFont();

  // Calcular a posição Y do elemento
  const { top } = element.getBoundingClientRect();
  const topOffset = top + (window.pageYOffset || document.documentElement.scrollTop);

  const canvas = await html2canvas(element, {
    y: -topOffset,
    foreignObjectRendering: true,
    onclone: (clonedDocument) => {
      prepareSVGs(clonedDocument, clonedDocument.body, fontBase64);
      prepareDescription(clonedDocument);

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
  const [width, height] = [210, 297];
  const jspdf = new jsPDF({
    format: [width, height]
  });
  const zoom = width / window.innerWidth;

  // Baixar e armazenar fonte dentro do PDF
  const [fontBase64, font] = await downloadFont();
  jspdf.addFileToVFS("Lato-Regular-normal.ttf", font);
  jspdf.addFont("Lato-Regular-normal.ttf", "Lato Regular", "normal");

  // Renderizar elementos (exceto SVGs)
  await jspdf.html(element, {
    width: width,
    windowWidth: window.innerWidth,
    x: 0,
    y: 0
  });

  // Adicionar SVGs como imagens, 1 por 1
  const elems = element.getElementsByTagName("svg");
  for (let i = 0; i < elems.length; i++) {
    const svg = elems.item(i);

    if (svg && svg.parentElement) {
      const rect = svg.getBoundingClientRect();
      const parentRect = svg.parentElement.getBoundingClientRect();
      const elRect = element.getBoundingClientRect();

      // Posição do svg relativa ao elemento sendo convertido para pdf
      const y = Math.abs(rect.y - elRect.y) * zoom;
      const x = Math.abs(rect.x - elRect.x) * zoom;

      // Calcular qual página está a imagem (sendo 0 a primeira página)
      const page = Math.floor(y / height);

      // Converter o svg para imagem
      const canvas = await html2canvas(svg.parentElement, {
        height: rect.height,
        width: rect.width,
        x: Math.abs(parentRect.x - rect.x),
        y: Math.abs(parentRect.y - rect.y),
        onclone: (clonedDocument) => {
          prepareSVGs(clonedDocument, clonedDocument.body, fontBase64);
        }
      });
      const png = canvas.toDataURL("image/png");

      // Para o jspdf a primeira página é a 1
      jspdf.setPage(page + 1);
      jspdf.addImage(png, x, y - page * height, rect.width * zoom, rect.height * zoom);

      // Se a imagem ocupa mais de uma página, ela tem que ser adicionada outra vez
      if (y + rect.height * zoom > height) {
        jspdf.setPage(page + 2);
        jspdf.addImage(png, x, y - (page + 1) * height, rect.width * zoom, rect.height * zoom);
      }
    }
  }

  return jspdf.output("blob");
};

export default DataVisualization;
