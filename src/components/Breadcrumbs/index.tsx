import React, { useState } from "react";
import { MobileButton, Selects, MobileBar, Children, Container } from "./styles";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import { useSelection } from "hooks/SelectionContext";
import BreadcrumbSelect from "./Select";

const Breadcrumbs = ({ children }) => {
  const { num, uf, ano, cad, deg, prc, cns, tpo, eixo } = useSelection();
  const { config } = useSelection();

  // Controla se a barra lateral está visivel no mobile
  const [active, setActive] = useState<boolean>(false);

  const getValueById = (id): number => {
    switch (id) {
      case "var":
        return num;
      case "uf":
        return uf;
      case "ano":
        return ano;
      case "cad":
        return cad;
      case "deg":
        return deg;
      case "eixo":
        return eixo;
      case "prc":
        return prc;
      case "tpo":
        return tpo;
      case "cns":
        return cns;
      default:
        return 1;
    }
  };

  return (
    <Container>
      <MobileButton id="mobileButton" className="open" onClick={() => setActive(true)}>
        <AiOutlineMenu />
      </MobileButton>
      <MobileBar id="mobileBar" className={active ? "active" : ""}>
        <MobileButton onClick={() => setActive(false)}>
          <AiOutlineClose />
        </MobileButton>
        <Selects>
          {config.breadcrumbs.map((opt, i) => {
            return (
              <BreadcrumbSelect
                key={i}
                value={getValueById(opt.id)}
                id={opt.id}
                label={opt.label}
                options={opt.options}
                color={config.primaryColor}
              />
            );
          })}
        </Selects>
      </MobileBar>
      <Children className={active ? "active" : ""}>{children}</Children>
    </Container>
  );
};

export default Breadcrumbs;
