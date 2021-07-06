import React from "react";
import { Container } from "./styles";

import { useSelection } from "hooks/SelectionContext";
import BreadcrumbSelect from "./Select";

const Breadcrumbs = () => {
  const { num, uf, ano, cad, prt, eixo } = useSelection();
  const { options: selectOptions } = useSelection();

  return (
    <Container>
      {!!selectOptions && !!selectOptions.var && (
        <>
          <BreadcrumbSelect value={eixo} id="eixo" label="Eixo" options={selectOptions.eixo} />
          <BreadcrumbSelect value={num} id="var" label="Variável" options={selectOptions.var[eixo]} />
          <BreadcrumbSelect value={uf} id="uf" label="UF" options={selectOptions.uf} />
          <BreadcrumbSelect value={ano} id="ano" label="Ano" options={selectOptions.ano} />
          <BreadcrumbSelect value={cad} id="cad" label="Setor" options={selectOptions.cad} />
          <BreadcrumbSelect value={prt} id="prt" label="Porte" options={selectOptions.prt} />
        </>
      )}
    </Container>
  );
};

export default Breadcrumbs;
