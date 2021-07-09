import React from "react";
import { ISimpleBreadCrumb, useSelection } from "hooks/SelectionContext";
import { Container, Label, Select, Option } from "./styles";

interface IBreadcrumbProps extends ISimpleBreadCrumb {
  value: number;
}

const BreadcrumbSelect: React.FC<IBreadcrumbProps> = ({ id, label, options, value }) => {
  const { changeSelection } = useSelection();

  return (
    <Container>
      <Label htmlFor={id}>{label}</Label>
      {options && (
        <Select
          disabled={options.length === 1}
          name={id}
          id={id}
          value={value}
          onChange={(e) => changeSelection(id, Number(e.target.value))}
        >
          {options.map((opt) => (
            <Option key={opt.id} value={opt.id}>
              {opt.nome}
            </Option>
          ))}
        </Select>
      )}
    </Container>
  );
};

export default BreadcrumbSelect;
