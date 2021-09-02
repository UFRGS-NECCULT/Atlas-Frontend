# Atlas OBEC

Atlas econômico da cultura brasileira (OBEC - UFRGS)

## Tecnologias utilizadas

* WIP

## Documentação para instalar o Atlas

### Instalação via docker

**Windows**

* WIP

**Debian/Ubuntu**

* WIP


**CentOS/Fedora**

* WIP


### Instalação sem docker

* WIP

## Requisitos e Funcionalidades

* WIP

## DER e Banco de Dados

* WIP
  
## Fluxograma do Atlas

* WIP
- [Atlas OBEC](#atlas-obec)
  - [Adicionando Novos Pacotes ao Projeto](#adicionando-novos-pacotes-ao-projeto)
  - [React e D3](#react-e-d3)

## Adicionando Novos Pacotes ao Projeto

Os pacotes do frontend são instalados dentro da própria imagem docker, o que requer alguns passos extras na hora de adicionar bibliotecas ao projeto:

Instale os pacotes desejados, desenvolva e teste a aplicação fora do docker (usando `npm start`). Depois, rode os seguintes comandos:

1. `docker-compose rm app` Remove a imagem antiga, sem os novos pacotes
2. `docker-compose up --build` Reconstrói a imagem com os novos pacotes

