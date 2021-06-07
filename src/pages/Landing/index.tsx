import GovBar from "components/BrGobBar";
import React from "react";
import { Page } from "./styles";

import AtlasLogo from "../../assets/images/Atlas.png";

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
      <section>
        <h1>-----------</h1>
      </section>
    </Page>
  );
};

export default LandingPage;
