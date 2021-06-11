import React from "react";
import { Content } from "./styles";
const Footer = () => {
  return (
    <Content>
      <a target="_blank" href="http://www.acessoainformacao.gov.br/">
        <span className="logo-acesso-footer"></span>
      </a>
      <a target="_blank" href="http://ufrgs.br/obec/neccult">
        <span className="logo-neccult-footer logo-footer"></span>
      </a>
      <a target="_blank" href="http://ufrgs.br/">
        <span className="logo-ufrgs-footer logo-footer"></span>
      </a>
      <a target="_blank" href="http://www.cultura.gov.br/secretaria-da-economia-da-cultura">
        <span className="logo-ecocultura-footer logo-footer"></span>
      </a>
      <a target="_blank" href="http://www.cultura.gov.br/">
        <span className="logo-minc-footer logo-footer"></span>
      </a>
      <a target="_blank" href="http://www.brasil.gov.br/">
        <span className="logo-brasil-footer"></span>
      </a>
    </Content>
  );
};

export default Footer;
