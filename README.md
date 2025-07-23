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

---

## Considerações Finais

Este projeto foi desenvolvido com foco em boas práticas de desenvolvimento, arquitetura limpa e testabilidade, visando facilitar a manutenção e evolução futura da aplicação.

