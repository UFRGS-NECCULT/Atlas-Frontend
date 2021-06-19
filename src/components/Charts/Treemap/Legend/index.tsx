import React from "react";
import { Container, List, Setor, Title } from "./styles";

interface IProps {
  data: ILegendData[];
}

interface ILegendData {
  label: string;
  color: string;
}
const TreemapLegend: React.FC<IProps> = ({ data }) => {
  console.log(data);
  return (
    <Container>
      <Title>Setores</Title>
      <List>
        {data?.map((setor) => (
          <Setor key={setor.label}>
            <i style={{ backgroundColor: setor.color }}></i>
            <span>{setor.label}</span>
          </Setor>
        ))}
      </List>
    </Container>
  );
};

export default TreemapLegend;
