import React from "react";
import { MapIndex } from "./styles";
const Footer = () => {
  return (
    <MapIndex>
      <div className="index-content">
        <ul>
          <li>
            <b>Sobre o Atlas</b>
          </li>
          <li>
            <a href="http://www.brasil.gov.br/servicos/perguntas-frequentes-1" title="Perguntas frequentes">
              Perguntas Frequentes
            </a>
          </li>
          <li>
            <a href="http://www.brasil.gov.br/servicos/fale-com-o-governo" title="Glossário">
              Glossário
            </a>
          </li>
          <li>
            <a className="dropbtn" title="Links Relacionados">
              Links Relacionados
            </a>
          </li>
        </ul>

        <ul>
          <li>
            <b>Redes Sociais</b>
          </li>
          <li>
            <a href="http://www.facebook.com/MinisterioDaCultura">Facebook</a>
          </li>
          <li>
            <a href="http://www.instagram.com/culturagovbr/">Instagram</a>
          </li>
          <li>
            <a href="http://twitter.com/culturagovbr">Twitter</a>
          </li>
          <li>
            <a href="http://www.youtube.com/user/ministeriodacultura">YouTube</a>
          </li>
        </ul>
        <ul>
          <li>
            <b>Navegação</b>
          </li>
          <li>
            <a href="http://www.brasil.gov.br/acessibilidade" title="Acessibilidade" accessKey="5">
              Acessibilidade
            </a>
          </li>
          <li>
            <a href="#" title="Alto Contraste" accessKey="6">
              Alto Contraste
            </a>
          </li>
          <li>
            <a href="http://www.brasil.gov.br/mapadosite" title="Mapa do Site" accessKey="7">
              Mapa do Site
            </a>
          </li>
        </ul>
      </div>
    </MapIndex>
  );
};

export default Footer;
