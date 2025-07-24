# API Batalha de Monstros

## 1. Introdução e Visão Geral do Projeto

Esta API permite que jogadores escolham monstros para batalhar em uma arena virtual, onde os combates acontecem por turnos. O sistema gerencia jogadores, monstros e as batalhas entre eles, garantindo uma experiência interativa e em tempo real. O projeto foi desenvolvido com foco em escalabilidade, organização e facilidade de manutenção.

---

## 2. Tecnologias Utilizadas

- **Node.js**: Plataforma robusta para desenvolvimento backend com alta performance e grande comunidade.
- **NestJS**: Framework que oferece estrutura modular, injeção de dependência e suporte a TypeScript, facilitando a organização e manutenção do código.
- **PostgreSQL**: Banco de dados relacional confiável para armazenar dados estruturados.
- **Prisma ORM**: Facilita a manipulação do banco de dados com tipagem forte e geração automática de código, reduzindo erros e aumentando produtividade.
- **WebSockets**: Permite comunicação bidirecional em tempo real entre cliente e servidor, essencial para batalhas dinâmicas e atualizações instantâneas.
- **Jest e Supertest**: Ferramentas para testes unitários e de integração, garantindo qualidade e estabilidade do sistema.

---

## 3. Arquitetura do Projeto

O projeto é organizado em módulos, cada um responsável por uma funcionalidade específica:

- **Módulo Player**: Gerencia criação, atualização e remoção de jogadores.
- **Módulo Monster**: Gerencia os monstros disponíveis para batalha.
- **Módulo Battle**: Controla a lógica das batalhas, turnos, ataques e rendição.
- **Módulo Arena**: Gerencia arenas, entrada e saída de jogadores, início e fim de batalhas, e ações durante o combate.

Cada módulo contém:

- **Controllers**: Recebem e respondem às requisições HTTP.
- **Serviços**: Implementam a lógica de negócio.
- **Repositórios**: Interagem com o banco de dados.
- **Gateways (quando aplicável)**: Gerenciam comunicação em tempo real via WebSockets.

Essa modularização facilita a manutenção, escalabilidade e colaboração entre equipes. O uso de princípios SOLID, injeção de dependência, DTOs para validação e testes automatizados garantem um código limpo e confiável.

---

## 4. Como Funciona

- Jogadores criam seus perfis e escolhem monstros para batalhar.
- As batalhas são realizadas em turnos, onde cada monstro pode atacar, defender, usar ataque especial ou desistir.
- O módulo Arena permite criar arenas onde jogadores entram, iniciam batalhas e realizam ações.
- A comunicação em tempo real é feita via WebSockets, permitindo atualizações instantâneas durante as batalhas.
- O sistema registra o estado dos jogadores, monstros e batalhas no banco de dados para persistência e consulta.

---

## 5. Como Rodar a Aplicação

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

## 6. Endpoints da API

### Módulo Player

- `POST /players` - Cria um novo jogador.
  - Body: `{ "name": "nomeDoJogador" }`
- `PATCH /players/:id` - Atualiza o nome de um jogador.
  - Body: `{ "name": "novoNome" }`
- `DELETE /players/:id` - Remove um jogador.

### Módulo Monster

- `GET /monsters` - Lista todos os monstros.
- `GET /monsters/:id` - Retorna um monstro pelo ID.
- `POST /monsters` - Cria um novo monstro.
  - Body: `{ "name": "nomeDoMonstro", "power": valor, ... }` (conforme DTO)
- `PATCH /monsters/:id` - Atualiza o nome do monstro.
  - Body: `{ "name": "novoNome" }`
- `DELETE /monsters/:id` - Remove um monstro.

### Módulo Arena

- `POST /arenas`
  - Cria uma nova arena.
  - Body: `{ "name": "Nome da Arena", "max_players": número }`
- `POST /arenas/:id/action`
  - Realiza uma ação do jogador na arena.
  - Body: `{ "player_id": número, "action": "attack|defend|special|forfeit", "target_id"?: string }`
- `POST /arenas/:id/join`
  - Jogador entra na arena.
  - Body: `{ "player_id": número, "monster_id": número }`
- `POST /arenas/:id/leave`
  - Jogador sai da arena.
  - Body: `{ "player_id": número }`
- `POST /arenas/:id/start`
  - Inicia a batalha na arena.
- `POST /arenas/:id/end`
  - Finaliza a batalha na arena.
  - Body: `{ "winner": { "player_id": número, "monster": string } }`

### Módulo Battle (WebSocket)

O módulo Battle não possui endpoints REST tradicionais. A comunicação ocorre via WebSockets no namespace `/battle`, com os seguintes eventos principais:

- `playerAvailable`: Envia o ID do jogador para entrar na fila de matchmaking.
- `startBattle`: Inicia a batalha entre jogadores pareados.
- `attack`: Realiza um ataque contra o oponente.
- `surrender`: Jogador desiste da batalha.

### Eventos WebSocket Emitidos

- `availableConfirmed`: Confirmação de entrada na fila.
- `battleStarted`: Notifica o início da batalha, enviando o estado inicial.
- `battleUpdate`: Atualiza o estado da batalha em tempo real, incluindo HP, ações realizadas e mudança de turno.
- `error`: Notifica erros, como tentativas inválidas ou problemas de conexão.

Para interagir com o módulo Battle, utilize um cliente WebSocket conectado ao namespace `/battle` e envie/escute os eventos acima conforme a lógica do jogo.

---

## 7. Testes

- Testes unitários e de integração são realizados com Jest e Supertest.
- Os testes cobrem os principais fluxos de negócio, validações e interações entre módulos.
- Comandos para rodar os testes:
  ```bash
  npm run test
  npm run test:cov
  ```

---

## 8. Considerações Finais

Este projeto foi desenvolvido com foco em qualidade, organização e escalabilidade, utilizando boas práticas e ferramentas modernas para garantir um sistema robusto e fácil de manter.

Se precisar de ajuda, pense no projeto como um jogo onde você cria jogadores e monstros, e eles lutam em batalhas. O sistema cuida de tudo isso para você, e este README explica como começar a usar.
