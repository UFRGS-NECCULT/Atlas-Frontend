import styled from "styled-components";

interface ContainerProps {
  id: string;
}

export const Container = styled.div`
  grid-area: ${(props: ContainerProps) => props.id};

  background-color: white;
  border-radius: 20px;
  border: 5px solid #ddd;
  padding: 15px;

  display: flex;
  flex-direction: column;
`;

export const BoxTitle = styled.div`
  width: 100%;
  color: #aaa;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: Lato Regular;
  text-transform: uppercase;
`;
