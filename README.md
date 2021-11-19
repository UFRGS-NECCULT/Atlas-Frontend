# Atlas OBEC

Atlas econômico da cultura brasileira (OBEC - UFRGS)

- [Atlas OBEC](#atlas-obec)
	- [Tecnologias utilizadas](#tecnologias-utilizadas)
	- [Documentação para instalação e execução do Atlas](#documentação-para-instalação-e-execução-do-atlas)
		- [Instalação via docker](#instalação-via-docker)
		- [Instalação sem docker](#instalação-sem-docker)
	- [Requisitos e Funcionalidades](#requisitos-e-funcionalidades)
		- [Requisitos Funcionais:](#requisitos-funcionais)
		- [Requisitos Não Funcionais:](#requisitos-não-funcionais)
		- [Requisitos Inversos:](#requisitos-inversos)
	- [Banco de Dados e DER](#banco-de-dados-e-der)
	- [Utilidades](#utilidades)
		- [Adicionando Novos Pacotes ao Projeto](#adicionando-novos-pacotes-ao-projeto)
		- [Deploy em hosts com pouca memória](#deploy-em-hosts-com-pouca-memória)
## Tecnologias utilizadas

Adicionando Novos Pacotes ao Projeto

* React (^17.0.2)
* NPM (6.14.12)
* NodeJS (v14.16.1)
* Typescript (^4.1.2)
* Docker Engine (v20.10.8)
* Docker Compose (3.7)
* PostgreSQL (13)

*Outras bibliotecas e frameworks:*
* axios: biblioteca para configuração de cliente HTTP
* styled-somponents: biblioteca para estilização de componentes React
* eslint e prettier: biblioteca para lint de código
* d3: biblioteca para manipulação do DOM e desenho dos gráficos/mapas
* topojson-client: biblioteca para manipulação de coordenadas para criação de mapas

## Documentação para instalação e execução do Atlas

### Instalação via docker

*Requisito(s): Docker Engine e Docker Compose*

* Criar uma cópia do arquivo `docker-compose.example.yml` e renomear para `docker-compose.yml`
* Adicionar na seção *enviroments* do arquivo criado, caso necessário, as variáveis de ambiente (por exemplo, host do backend)
* Rodar o comando `docker-compose up` na pasta raiz do projeto

### Instalação sem docker

* WIP

## Requisitos e Funcionalidades

### Requisitos Funcionais:
	- Menu dinâmico para os 4 eixos contendo para cada eixo os menus de variáveis, desagregações e periodicidade respectivos de cada eixo;

	- Para cada combinação possível e viável de variável, desagregação e período plotar informações nos seguintes formatos:
		- Choropleth Map
		(Mapa do Brasil cor dos estados por distribuição de frequência de valores)
		- Stacked Bar Chart
		(gráfico das informações conforme desagregação)
		- Treemap
		(gráfico das informações conforme desagregação)

	- Opção para baixar resultados no seguintes formatos:
		- CSV
		- Imagem PNG
		- PDF

	- Cadastro de informações na plataforma (?)
	(banco de dados relacional para eixos, variáveis, desagregações e períodos).

### Requisitos Não Funcionais:
	- Tempo de resposta para execução das funcionalidades aceitável (Complexidade Computacional a ser estimada para cada função)

	- Padronização do formato dos dados na plataforma. (IBGE)

### Requisitos Inversos:
	- Inconsistências nos dados


## Banco de Dados e DER

O banco escolhido para a persistência dos dados foi o banco relacional open source PostgreSQL 13.

![Diagrama Entidade Relacionamento](docs/er-diagram.png)

## Utilidades

### Adicionando Novos Pacotes ao Projeto

Os pacotes do frontend são instalados dentro da própria imagem docker, o que requer alguns passos extras na hora de adicionar bibliotecas ao projeto:

Instale os pacotes desejados, desenvolva e teste a aplicação fora do docker (usando `npm start`). Depois, rode os seguintes comandos:

1. `docker-compose rm app` Remove a imagem antiga, sem os novos pacotes
2. `docker-compose up --build` Reconstrói a imagem com os novos pacotes

### Deploy em hosts com pouca memória

O deploy em máquinas potentes é simples:

```bash
$ ssh server.mydomain.com # Shell remoto no host
$ git clone 'https://github.com/UFRGS-NECCULT/Frontend.git' # Clonar o código
$ docker network create atlas-network # Criar a rede do docker
$ docker-compose -f docker-compose-prod.yml up # Subir o container de produção
```

Mas esse processo builda a aplicação diretamente na máquina do servidor, e caso ela não seja boa o suficiente, pode faltar RAM (hospedar a aplicação é leve, o problema é na hora de buildar mesmo). Para evitar esse problema, temos que buildar a aplicação em nossa máquina e enviar essa versão pronta para o servidor:

1. Crie uma conta no [docker hub](https://hub.docker.com/)
2. Faça login nela via `$ docker login`
3. Builde a imagem com `$ docker build -f Dockerfile-prod .`
4. Copie o ID imagem produzida ("*Successfully built a0fea2f217e3*") e aplice uma tag nela com seu nome de usuário no dockerhub (o meu é pbcarrara, por exemplo): `$ docker tag a0fea2f217e3 pbcarrara/neccult-front:latest`
5. Envie essa imagem para o docker hub com `$ docker push pbcarrara/neccult-front:latest`
6. Teste localmente a imagem com `$ docker-compose -f docker-compose-prod.yml up`

Agora que produzimos e fizemos upload de uma imagem pronta, vamos fazer deploy dela no servidor:

```bash
$ ssh server.mydomain.com # Shell remoto no host
$ git clone 'https://github.com/UFRGS-NECCULT/Frontend.git' # Clonar o código
$ docker network create atlas-network # Criar a rede do docker
$ nano docker-compose-prod.yml

# Comentar a etapa de build e indicar a nossa imagem pronta para ser usada
    image: pbcarrara/neccult-front:latest
    # build:
    #   context: .
    #   dockerfile: Dockerfile-prod

$ docker pull pbcarrara/neccult-front:latest # Atualizar nossa imagem pronta
$ docker-compose -f docker-compose-prod.yml up # Subir o container de produção
```
