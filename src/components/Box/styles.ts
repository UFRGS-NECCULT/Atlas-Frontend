import styled from "styled-components";

interface ContainerProps {
  id: string;
}

export const Container = styled.div`
  grid-area: ${(props: ContainerProps) => props.id};

  background-color: white;
  border-radius: 20px;
  border: 5px solid #ddd;
`;
