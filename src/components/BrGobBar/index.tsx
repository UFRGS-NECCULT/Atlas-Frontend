import React from "react";

const GovBar = () => {
  return (
    //Barra nova
    <div id="barra-brasil" style={{ background: "#7F7F7F", height: "20px", padding: "0 0 0 10px", display: "block" }}>
      <ul id="menu-barra-temp" style={{ listStyle: "none" }}>
        <li
          style={{
            display: "inline",
            float: "left",
            paddingRight: "10px",
            marginRight: "10px",
            borderRight: "1px solid #EDEDED"
          }}
        >
          <a
            href="http://brasil.gov.br"
            style={{ fontFamily: "sans,sans-serif", textDecoration: "none", color: "white" }}
          >
            Portal do Governo Brasileiro
          </a>
        </li>
      </ul>
    </div>

    //Barra antiga

    // <div id="barra-brasil" style={{ background: "#7F7F7F", height: "20px", padding: "0 0 0 10px", display: "block" }}>
    //   <ul id="menu-barra-temp" style={{ listStyle: "none" }}>
    //     <li
    //       style={{
    //         display: "inline",
    //         float: "left",
    //         paddingRight: "10px",
    //         marginRight: "10px",
    //         borderRight: "1px solid #EDEDED"
    //       }}
    //     >
    //       <a
    //         href="http://brasil.gov.br"
    //         style={{ fontFamily: "sans,sans-serif", textDecoration: "none", color: "white" }}
    //       >
    //         Portal do Governo Brasileiro
    //       </a>
    //     </li>
    //     <li>
    //       <a
    //         style={{ fontFamily: "sans,sans-serif", textDecoration: "none", color: "white" }}
    //         href="http://epwg.governoeletronico.gov.br/barra/atualize.html"
    //       >
    //         Atualize sua Barra de Governo
    //       </a>
    //     </li>
    //   </ul>
    // </div>
  );
};

export default GovBar;
