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
          <BreadcrumbSelect defaultValue={num} id="var" label="Variável" options={selectOptions.var[eixo]} />
          <BreadcrumbSelect defaultValue={uf} id="uf" label="UF" options={selectOptions.uf} />
          <BreadcrumbSelect defaultValue={ano} id="ano" label="Ano" options={selectOptions.ano} />
          <BreadcrumbSelect defaultValue={cad} id="cad" label="Setor" options={selectOptions.cad} />
          <BreadcrumbSelect defaultValue={prt} id="prt" label="Porte" options={selectOptions.prt} />
        </>
      )}
    </Container>
  );
};

export default Breadcrumbs;
