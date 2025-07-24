# API Batalha de Monstros

## Visão Geral

Esta é uma API RESTful para batalhas online entre monstros, onde cada jogador pode escolher um monstro para entrar numa arena e os monstros se enfrentam em batalhas por turnos. A API foi desenvolvida utilizando Node.js com o framework NestJS, banco de dados PostgreSQL e Prisma ORM.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **NestJS**: Framework para construção de aplicações Node.js escaláveis e testáveis, baseado em TypeScript.
- **PostgreSQL**: Banco de dados relacional utilizado para persistência dos dados.
- **Prisma ORM**: ORM para Node.js e TypeScript, utilizado para modelagem e acesso ao banco de dados.
- **WebSockets**: Para comunicação em tempo real durante as batalhas.
- **Jest**: Framework de testes para JavaScript e TypeScript.
- **Supertest**: Biblioteca para testes de integração de APIs HTTP.

---

## Arquitetura

A aplicação segue uma arquitetura monolítica modularizada, organizada em módulos que agrupam controllers, serviços e repositórios relacionados a uma funcionalidade específica (exemplo: módulo Player).

### Princípios e Boas Práticas Aplicadas

- **Princípios SOLID**: Cada módulo e serviço tem responsabilidade única, facilitando manutenção e extensibilidade.
- **Injeção de Dependências**: Utilização do sistema de injeção de dependências do NestJS para desacoplar componentes.
- **Validação e Tratamento de Erros**: Uso de pipes de validação globais e exceções específicas para garantir robustez.
- **Testes Automatizados**: Cobertura de testes unitários e de integração para garantir qualidade e evitar regressões.
- **Modularização**: Organização do código em módulos para melhor organização e escalabilidade.
- **Uso de DTOs (Data Transfer Objects)**: Para validação e tipagem dos dados trafegados nas rotas.

---

## Como Rodar a Aplicação

### Pré-requisitos

- Node.js (versão 16 ou superior recomendada)
- PostgreSQL instalado e configurado
- Variável de ambiente `DATABASE_URL` configurada com a string de conexão do banco

### Passos para rodar

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a variável de ambiente `DATABASE_URL` no arquivo `.env` ou no ambiente do sistema.

4. Execute as migrações do Prisma para criar as tabelas no banco:
   ```bash
   npx prisma migrate deploy
   ```

5. Inicie a aplicação:
   ```bash
   npm run start:dev
   ```

---

## Rotas Disponíveis

### Player

- `POST /players` - Cria um novo jogador.
  - Body: `{ "name": "nomeDoJogador" }`
- `PATCH /players/:id` - Atualiza o nome de um jogador.
  - Body: `{ "name": "novoNome" }`
- `DELETE /players/:id` - Remove um jogador.

### Monster

- `GET /monsters` - Lista todos os monstros.
- `GET /monsters/:id` - Retorna um monstro pelo ID.
- `POST /monsters` - Cria um novo monstro.
  - Body: `{ "name": "nomeDoMonstro", "power": valor, ... }` (conforme DTO)
- `PATCH /monsters/:id` - Atualiza o nome do monstro.
  - Body: `{ "name": "novoNome" }`
- `DELETE /monsters/:id` - Remove um monstro.


---

## Testes

- Para rodar os testes unitários e de integração:
  ```bash
  npm run test
  ```

- Para rodar os testes com cobertura:
  ```bash
  npm run test:cov
  ```

# API Batalha de Monstros

## Visão Geral

Esta API permite que jogadores escolham monstros para batalhar em uma arena virtual, onde os combates acontecem por turnos. O sistema gerencia jogadores, monstros e as batalhas entre eles, garantindo uma experiência interativa e em tempo real.

## Como Funciona

- Jogadores criam seus perfis e escolhem monstros para batalhar.
- As batalhas são realizadas em turnos, onde cada monstro pode atacar, defender ou se render.
- A comunicação em tempo real é feita via WebSockets, permitindo atualizações instantâneas durante as batalhas.
- O sistema registra o estado dos jogadores, monstros e batalhas no banco de dados para persistência e consulta.

---

## Tecnologias Utilizadas e Motivos das Escolhas

- **Node.js**: Plataforma robusta para desenvolvimento backend com alta performance.
- **NestJS**: Framework que oferece estrutura modular, injeção de dependência e suporte a TypeScript, facilitando a organização e manutenção do código.
- **PostgreSQL**: Banco de dados relacional confiável para armazenar dados estruturados.
- **Prisma ORM**: Facilita a manipulação do banco de dados com tipagem forte e geração automática de código.
- **WebSockets**: Permite comunicação bidirecional em tempo real entre cliente e servidor, essencial para batalhas dinâmicas.
- **Jest e Supertest**: Ferramentas para testes unitários e de integração, garantindo qualidade e estabilidade do sistema.

---

## Arquitetura do Projeto

O projeto é organizado em módulos, cada um responsável por uma funcionalidade específica:

- **Módulo Player**: Gerencia criação, atualização e remoção de jogadores.
- **Módulo Monster**: Gerencia os monstros disponíveis para batalha.
- **Módulo Battle**: Controla a lógica das batalhas, turnos, ataques e rendição.

Cada módulo contém:

- **Controllers**: Recebem e respondem às requisições HTTP.
- **Serviços**: Implementam a lógica de negócio.
- **Repositórios**: Interagem com o banco de dados.

Essa modularização facilita a manutenção, escalabilidade e colaboração entre equipes.

---

## Princípios e Boas Práticas Aplicadas

- **Princípios SOLID**: Cada componente tem responsabilidade única, facilitando alterações e testes.
- **Injeção de Dependência**: Desacopla componentes, tornando o código mais flexível e testável.
- **Validação e Tratamento de Erros**: Uso de pipes e middlewares para garantir dados válidos e respostas apropriadas.
- **Testes Automatizados**: Cobertura de testes unitários e de integração para prevenir regressões.
- **Uso de DTOs (Data Transfer Objects)**: Validação e tipagem dos dados trafegados, aumentando segurança e clareza.
- **Modularização**: Organização clara do código em módulos para facilitar entendimento e evolução.

---

## Como Usar

### Pré-requisitos

- Instalar Node.js (versão 16 ou superior)
- Instalar e configurar PostgreSQL
- Configurar variável de ambiente `DATABASE_URL` com a string de conexão do banco

### Passos para rodar

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a variável de ambiente `DATABASE_URL` no arquivo `.env` ou no ambiente do sistema.

4. Execute as migrações do Prisma para criar as tabelas no banco:
   ```bash
   npx prisma migrate deploy
   ```

5. Inicie a aplicação:
   ```bash
   npm run start:dev
   ```

### Utilizando a API

Com o servidor rodando, utilize ferramentas como Postman para interagir com as rotas:

- Criar, listar,  atualizar e remover jogadores (`/players`)
- Criar, listar,  atualizar e remover monstros (`/monsters`)
- Iniciar e controlar batalhas (`/battle`)

---

## Testes e Meta de Cobertura

- Testes unitários e de integração são realizados com Jest e Supertest.
- Os testes cobrem os principais fluxos de negócio, validações e interações entre módulos.
- A meta é alcançar cobertura superior a 80% para garantir confiabilidade e facilitar manutenção.
- Comandos para rodar os testes:
  ```bash
  npm run test
  npm run test:cov
  ```

---

## Considerações Finais

Este projeto foi desenvolvido com foco em qualidade, organização e escalabilidade, utilizando boas práticas e ferramentas modernas para garantir um sistema robusto e fácil de manter.

Se precisar de ajuda, pense no projeto como um jogo onde você cria jogadores e monstros, e eles lutam em batalhas. O sistema cuida de tudo isso para você, e este README explica como começar a usar.
