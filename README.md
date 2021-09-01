# Atlas OBEC

- [Atlas OBEC](#atlas-obec)
  - [Adicionando Novos Pacotes ao Projeto](#adicionando-novos-pacotes-ao-projeto)
  - [React e D3](#react-e-d3)

## Adicionando Novos Pacotes ao Projeto

Os pacotes do frontend são instalados dentro da própria imagem docker, o que requer alguns passos extras na hora de adicionar bibliotecas ao projeto:

Instale os pacotes desejados, desenvolva e teste a aplicação fora do docker (usando `npm start`). Depois, rode os seguintes comandos:

1. `docker-compose rm app` Remove a imagem antiga, sem os novos pacotes
2. `docker-compose up --build` Reconstrói a imagem com os novos pacotes

## React e D3

Artigo muito bom para integração de React e D3 com hooks.
https://medium.com/@jeffbutsch/using-d3-in-react-with-hooks-4a6c61f1d102