import GovBar from "components/BrGobBar";
import React from "react";
import { Page } from "./styles";

import AtlasLogo from "../../assets/images/Atlas.png";
import eixo1 from "../../assets/images/eixo1.png";
import eixo2 from "../../assets/images/eixo2.png";
import eixo3 from "../../assets/images/eixo3.png";
import eixo4 from "../../assets/images/eixo4.png";
import logoFinal from "../../assets/images/atlas_dark.png";
import { Separator } from "components/Separator1";
import MapIndex from "components/MapIndex";
import Footer from "components/Footer";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Page>
      <section className="section-with-background">
        <GovBar />
        <div className="container">
          <div className="content">
            <p>Bem-vindo ao</p>
            <img src={AtlasLogo} alt="Logo" />
            <div className="explorar">Explorar</div>
          </div>
        </div>
      </section>
      <section id="section2">
        <div className="container">
          <div className="intro-text">
            O Atlas é uma ferramenta de pesquisa, disponibilização e visualização de dados da <br /> cultura na economia
            brasileira. Ela permite que você:
          </div>
          <div className="separator"></div>
          <div className="eixos">
            <Link to="/resultado?eixo=1">
              <div className="eixo">
                <img src={eixo1} alt="eixo1" />
              </div>
            </Link>
            <Link to="/resultado?eixo=2">
              <div className="eixo">
                <img src={eixo2} alt="eixo2" />
              </div>
            </Link>
            <Link to="/resultado?eixo=3">
              <div className="eixo">
                <img src={eixo3} alt="eixo3" />
              </div>
            </Link>
            <Link to="/resultado?eixo=4">
              <div className="eixo">
                <img src={eixo4} alt="eixo4" />
              </div>
            </Link>
          </div>
          <div className="text-atlas">
            <p className="question-title">
              Por que construir um <br /> Atlas da Economia da
              <br /> Cultura no Brasil?
            </p>
            <Separator />
            <p className="question-answer">
              Para mapear e sistematizar um vasto conjunto de informações relacionadas ao panorama econômico e produtivo
              da cultura no Brasil. Combinando acessibilidade e fundamentação acadêmica, o Atlas Econômico da Cultura
              Brasileira apresenta e discute dados, indicadores e estatísticas culturais, impulsionando o debate sobre o
              papel da cultura na economia brasileira.
            </p>

            <p className="question-title">
              Por que dividir o Atlas em <br /> quatro eixos?
            </p>
            <Separator />
            <p className="question-answer">
              Porque o processo da economia criativa e da cultura no território brasileiro deve ser estudado a partir de
              diversas dimensões e eixos de indicadores. A organização em torno de eixos busca facilitar a identificação
              de gargalos e potenciais tendo em vista a formulação de políticas públicas mais consistentes e adequadas
              às necessidades do país.
            </p>
          </div>
          <div className="final-logo">
            <img src={logoFinal} alt="Logo" />
          </div>
          <div className="footer-container">
            <MapIndex />
            <Footer />
          </div>
        </div>
      </section>
    </Page>
  );
};

export default LandingPage;
