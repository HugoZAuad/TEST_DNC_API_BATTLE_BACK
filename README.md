# API Batalha de Monstros

## Visão Geral

Esta API foi desenvolvida para proporcionar uma experiência dinâmica de batalhas online entre monstros, onde jogadores podem criar seus perfis, escolher monstros e participar de combates em arenas virtuais. O sistema gerencia todo o ciclo de vida dos jogadores, monstros e batalhas, garantindo comunicação em tempo real e integridade dos dados.

---

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do código JavaScript no servidor, garantindo desempenho e escalabilidade.
- **NestJS**: Framework progressivo para Node.js que facilita a construção de aplicações modulares e testáveis com TypeScript.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar informações persistentes de jogadores, monstros e batalhas.
- **Prisma ORM**: Ferramenta para modelagem e manipulação do banco de dados, simplificando consultas e migrações.
- **Socket.IO (WebSockets)**: Comunicação bidirecional em tempo real entre cliente e servidor para atualização instantânea das batalhas.
- **Jest**: Framework para testes unitários e de integração, assegurando a qualidade e estabilidade do código.
- **Supertest**: Biblioteca para testes de endpoints HTTP, garantindo o funcionamento correto da API.
- **class-validator**: Validação rigorosa dos dados recebidos nas requisições para garantir segurança e consistência.

---

## Arquitetura e Boas Práticas

A aplicação segue uma arquitetura modular, onde cada módulo é responsável por uma funcionalidade específica, como jogadores, monstros, arenas e batalhas. Essa organização facilita a manutenção, escalabilidade e colaboração entre equipes.

Principais boas práticas aplicadas:

- **Modularização**: Separação clara de responsabilidades em módulos independentes.
- **Princípios SOLID**: Código estruturado para garantir responsabilidade única, extensibilidade e fácil manutenção.
- **Injeção de Dependências**: Uso do NestJS para desacoplamento e facilidade nos testes.
- **Validação e Tratamento de Erros**: Implementação de pipes e middlewares para garantir dados válidos e tratamento adequado de exceções.
- **Testes Automatizados**: Cobertura abrangente com testes unitários e de integração para evitar regressões.
- **DTOs (Data Transfer Objects)**: Uso de objetos de transferência para validação e tipagem dos dados trafegados.
- **Comunicação em tempo real via WebSockets**: Eventos para registro de jogadores, início de batalhas e ataques.

---

## Como Rodar a Aplicação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL instalado e configurado
- Variável de ambiente `DATABASE_URL` configurada com a string de conexão do banco

### Banco de Dados

O banco de dados PostgreSQL utilizado neste projeto está hospedado no [Supabase](https://supabase.com/), uma plataforma moderna para bancos gerenciados na nuvem.
Para acessar, configurar ou alterar o banco, utilize o painel do Supabase e atualize a variável de ambiente `DATABASE_URL` conforme necessário.

### Passos para executar

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

5. Inicie a aplicação em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

---

## Endpoints da API

### Jogadores (Players)

- **POST /players**: Cria um novo jogador.
  - Body:
    ```json
    {
      "name": "nomeDoJogador",
      "winners": 0,
      "losses": 0
    }
    ```
- **GET /players**: Lista todos os jogadores.
- **GET /players/:id**: Retorna um jogador pelo ID.
- **GET /players/name/:username**: Retorna um jogador pelo nome de usuário.
- **PATCH /players/:id**: Atualiza o nome do jogador.
  - Body:
    ```json
    {
      "name": "novoNome"
    }
    ```
- **DELETE /players/:id**: Remove um jogador.

---

### Monstros (Monsters)

- **POST /monsters**: Cria um novo monstro.
  - Body:
    ```json
    {
      "name": "nomeDoMonstro",
      "hp": 100,
      "attack": 10,
      "defense": 5,
      "speed": 7,
      "specialAbility": "habilidadeEspecial"
    }
    ```
- **GET /monsters**: Lista todos os monstros.
- **GET /monsters/:id**: Retorna um monstro pelo ID.
- **GET /monsters/name/:name**: Retorna um monstro pelo nome.
- **PATCH /monsters/:id**: Atualiza o nome do monstro.
  - Body:
    ```json
    {
      "name": "novoNome"
    }
    ```
- **DELETE /monsters/:id**: Remove um monstro.

---

### Arenas

- **POST /arenas**: Cria uma nova arena para batalhas.
  - Body:
    ```json
    {
      "name": "nomeDaArena",
      "max_players": 10
    }
    ```
- **POST /arenas/:id/action**: Envia uma ação do jogador na arena.
  - Body:
    ```json
    {
      "player_id": 1,
      "action": "açãoDoJogador"
    }
    ```
- **POST /arenas/:id/join**: Jogador entra na arena.
  - Body:
    ```json
    {
      "player_id": 1,
      "monster_id": 2
    }
    ```
- **POST /arenas/:id/leave**: Jogador sai da arena.
  - Body:
    ```json
    {
      "player_id": 1
    }
    ```
- **POST /arenas/:id/start**: Inicia a batalha na arena. (Sem body)
- **POST /arenas/:id/end**: Encerra a batalha na arena.
  - Body:
    ```json
    {
      "winner": {
        "player_id": 1,
        "monster": "nomeDoMonstroVencedor"
      }
    }
    ```

---

## Eventos WebSocket (Batalhas)

- **Evento: `registerPlayer`**
  - Payload:
    ```json
    {
      "playerId": "idDoJogador"
    }
    ```
  - Descrição: Registra o socket do jogador para comunicação em tempo real.

- **Evento: `handleStartBattle`**
  - Payload:
    ```json
    {
      "playerId": 1
    }
    ```
  - Descrição: Inicia a batalha para o jogador.

- **Evento: `handleAttack`**
  - Payload:
    ```json
    {
      "playerId": "idDoJogador",
      "targetId": "idDoAlvo"
    }
    ```
  - Descrição: Envia um ataque do jogador para o alvo.

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
