import React from "react";
import { Container } from "./styles";

import { useSelection } from "hooks/SelectionContext";
import BreadcrumbSelect from "./Select";

const Breadcrumbs = () => {
  const { num, uf, ano, cad, deg, eixo } = useSelection();
  const { options } = useSelection();

  console.log(options);

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
      {options.map((opt, i) => {
        return (
          <BreadcrumbSelect key={i} value={getValueById(opt.id)} id={opt.id} label={opt.label} options={opt.options} />
        );
      })}
    </Container>
  );
};

export default Breadcrumbs;
