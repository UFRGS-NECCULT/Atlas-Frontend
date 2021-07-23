import { useSelection } from "hooks/SelectionContext";
import React from "react";
import { Container, List, Setor, Title } from "./styles";

interface IProps {
  data: ILegendData[];
  title: string;
  selector: string;
}

export interface ILegendData {
  label: string;
  color: string;
  id: number;
}
const Legend: React.FC<IProps> = ({ data, title, selector }) => {
  const { changeSelection } = useSelection();

  const handleClick = (id) => {
    changeSelection(selector, id);
  };

  return (
    <Container>
      <Title>{title}</Title>
      <List>
        {data?.map((setor) => (
          <Setor key={setor.id} onClick={() => handleClick(setor.id)}>
            <i style={{ backgroundColor: setor.color }}></i>
            <span>{setor.label}</span>
          </Setor>
        ))}
      </List>
    </Container>
  );
};

export default Legend;
