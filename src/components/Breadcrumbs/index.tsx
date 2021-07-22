import React from "react";
import { MobileButton, Selects, MobileBar, Children, Container } from "./styles";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import { useSelection } from "hooks/SelectionContext";
import BreadcrumbSelect from "./Select";
import { useState } from "react";

const Breadcrumbs: React.FC = ({ children }) => {
  const { num, uf, ano, cad, deg, eixo } = useSelection();
  const { options } = useSelection();

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
      default:
        return 1;
    }
  };

  return (
    <Container>
      <MobileButton className="open" onClick={() => setActive(true)}>
        <AiOutlineMenu />
      </MobileButton>
      <MobileBar className={active ? "active" : ""}>
        <MobileButton onClick={() => setActive(false)}>
          <AiOutlineClose />
        </MobileButton>
        <Selects>
          {options.map((opt, i) => {
            return (
              <BreadcrumbSelect
                key={i}
                value={getValueById(opt.id)}
                id={opt.id}
                label={opt.label}
                options={opt.options}
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
