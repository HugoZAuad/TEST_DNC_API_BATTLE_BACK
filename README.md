# API Batalha de Monstros

## Visão Geral

Esta API permite batalhas online entre monstros, onde jogadores podem criar seus personagens, escolher monstros e participar de batalhas em arenas. O sistema gerencia a criação, atualização e exclusão de jogadores e monstros, além de organizar as batalhas em tempo real, proporcionando uma experiência dinâmica e interativa.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor, garantindo alta performance e escalabilidade.
- **NestJS**: Framework moderno para construção de aplicações escaláveis e organizadas, utilizando TypeScript.
- **PostgreSQL**: Banco de dados relacional robusto para armazenamento seguro e eficiente dos dados.
- **Prisma ORM**: Ferramenta para modelagem e acesso ao banco de dados, facilitando operações e garantindo segurança.
- **WebSockets**: Comunicação em tempo real para atualização instantânea das batalhas entre jogadores.
- **Jest**: Framework para testes unitários e de integração, assegurando a qualidade do código.
- **Supertest**: Biblioteca para testes de APIs HTTP, garantindo o correto funcionamento dos endpoints.

---

## Arquitetura

A aplicação é estruturada em uma arquitetura modular monolítica, onde cada módulo é responsável por uma funcionalidade específica, como jogadores, monstros e batalhas. Essa organização facilita a manutenção, escalabilidade e colaboração entre equipes.

### Princípios e Boas Práticas

- **Modularização**: Código organizado em módulos independentes para melhor organização e escalabilidade.
- **Princípios SOLID**: Garantia de responsabilidade única, extensibilidade e fácil manutenção do código.
- **Injeção de Dependências**: Uso do sistema do NestJS para desacoplar componentes e facilitar testes.
- **Validação e Tratamento de Erros**: Implementação de pipes e middlewares para garantir dados válidos e tratamento adequado de exceções.
- **Testes Automatizados**: Cobertura abrangente com testes unitários e de integração para evitar regressões.
- **DTOs (Data Transfer Objects)**: Validação e tipagem rigorosa dos dados trafegados nas rotas, aumentando a segurança.

---

## Como Rodar a Aplicação

### Pré-requisitos

- Node.js (versão 16 ou superior)
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

## Uso da API

### Jogadores (Players)

- `POST /players`: Cria um novo jogador.
  - Body: `{ "name": "nomeDoJogador" }`
- `PATCH /players/:id`: Atualiza o nome do jogador.
  - Body: `{ "name": "novoNome" }`
- `DELETE /players/:id`: Remove um jogador.

### Monstros (Monsters)

- `GET /monsters`: Lista todos os monstros.
- `GET /monsters/:id`: Retorna um monstro pelo ID.
- `POST /monsters`: Cria um novo monstro.
  - Body: `{ "name": "nomeDoMonstro", "power": valor, ... }`
- `PATCH /monsters/:id`: Atualiza o nome do monstro.
  - Body: `{ "name": "novoNome" }`
- `DELETE /monsters/:id`: Remove um monstro.

### Arenas e Batalhas

- `POST /arenas`: Cria uma nova arena para batalhas.
- `POST /arenas/:id/join`: Jogador entra na arena.
- As batalhas são organizadas automaticamente após 1 minuto de abertura da arena, com jogadores pareados para batalhas ou enfrentando bots se necessário.

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

Este projeto foi desenvolvido com foco em boas práticas, arquitetura limpa e testabilidade, visando facilitar a manutenção e evolução futura da aplicação. A modularização e o uso de tecnologias modernas garantem escalabilidade, robustez e facilidade de uso.

Para mais detalhes, consulte as rotas disponíveis e os testes implementados para entender o funcionamento completo da API.
