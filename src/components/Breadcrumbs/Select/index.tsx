import React from "react";
import { useSelection } from "hooks/SelectionContext";
import { Container, Label, Select, Option } from "./styles";

interface BreadcumbSelectProps {
  id: string;
  label: string;
  defaultValue: number;
  options: {
    name: string;
    value?: string | number;
    id?: string | number;
  }[];
}

const BreadcrumbSelect: React.FC<BreadcumbSelectProps> = ({ id, label, options, defaultValue }) => {
  const { changeSelection } = useSelection();

  return (
    <Container>
      <Label htmlFor={id}>{label}</Label>
      {options && (
        <Select
          name={id}
          id={id}
          defaultValue={defaultValue}
          onChange={(e) => changeSelection(id, Number(e.target.value))}
        >
          {options.map((opt) => (
            <Option key={opt.id || opt.value || 0} value={opt.id || opt.value || 0}>
              {opt.name}
            </Option>
          ))}
        </Select>
      )}
    </Container>
  );
};

export default BreadcrumbSelect;
