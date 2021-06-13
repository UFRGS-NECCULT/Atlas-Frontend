import React from "react";
import { Container, List, Setor, Title } from "./styles";

interface IProps {
  data?: {
    idCadeia: number;
    CadeiaNome: string;
    UFNome: string;
    Percentual: number;
    Taxa: number;
    Valor: number;
  }[];
}

const TreemapLegend: React.FC<IProps> = ({ data }) => {
  return (
    <Container>
      <Title>Setores</Title>
      <List>
        {data?.map((setor) => (
          <Setor key={setor.idCadeia}>
            <i></i>
            <span>{setor.CadeiaNome}</span>
          </Setor>
        ))}
      </List>
    </Container>
  );
};

export default TreemapLegend;
