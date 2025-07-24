# API Batalha de Monstros

## Visão Geral

Esta API permite batalhas online entre monstros, onde jogadores podem criar seus personagens, escolher monstros e participar de batalhas em arenas. O sistema gerencia a criação, atualização e exclusão de jogadores e monstros, além de organizar as batalhas em tempo real.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **NestJS**: Framework para construção de aplicações escaláveis e organizadas em TypeScript.
- **PostgreSQL**: Banco de dados relacional para armazenamento dos dados.
- **Prisma ORM**: Ferramenta para modelagem e acesso ao banco de dados de forma segura e eficiente.
- **WebSockets**: Comunicação em tempo real para atualização das batalhas.
- **Jest**: Framework para testes unitários e de integração.
- **Supertest**: Biblioteca para testes de APIs HTTP.

---

## Arquitetura

A aplicação segue uma arquitetura modular monolítica, organizada em módulos que agrupam funcionalidades relacionadas, como jogadores, monstros e batalhas.

### Princípios e Boas Práticas

- **Modularização**: Cada módulo é responsável por uma parte específica do sistema, facilitando manutenção e escalabilidade.
- **Princípios SOLID**: Código organizado para garantir responsabilidade única, extensibilidade e fácil manutenção.
- **Injeção de Dependências**: Uso do sistema do NestJS para desacoplar componentes e facilitar testes.
- **Validação e Tratamento de Erros**: Uso de pipes e middlewares para garantir dados válidos e tratamento adequado de exceções.
- **Testes Automatizados**: Cobertura de testes unitários e de integração para garantir qualidade e evitar regressões.
- **DTOs (Data Transfer Objects)**: Para validação e tipagem dos dados trafegados nas rotas.

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

Este projeto foi desenvolvido com foco em boas práticas, arquitetura limpa e testabilidade, visando facilitar a manutenção e evolução futura da aplicação. A modularização e o uso de tecnologias modernas garantem escalabilidade e facilidade de uso.

---

## Atualizações Recentes

### Resolução de Dependência Circular

Durante o desenvolvimento, foi identificada uma dependência circular entre os serviços ArenaCreationService e ArenaStateService. Para resolver esse problema, foi utilizado o padrão do NestJS com o decorator `@Inject` combinado com `forwardRef` na injeção dessas dependências.

Essa abordagem permite que os serviços se referenciem mutuamente sem causar erros de injeção, garantindo o funcionamento correto da aplicação.

### Impacto nos Testes

As alterações na injeção das dependências exigiram atualizações nos testes unitários dos serviços mencionados para garantir compatibilidade e funcionamento adequado.

Os testes foram revisados e adaptados para simular corretamente as dependências usando mocks e injeção simulada.

---

Se precisar de ajuda, consulte as rotas disponíveis e os testes para entender o funcionamento detalhado da API.
