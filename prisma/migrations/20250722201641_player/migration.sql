-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerMonster" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "monsterId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PlayerMonster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "specialAbility" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" SERIAL NOT NULL,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMonster_playerId_position_key" ON "PlayerMonster"("playerId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMonster_playerId_monsterId_key" ON "PlayerMonster"("playerId", "monsterId");

-- CreateIndex
CREATE UNIQUE INDEX "Monster_name_key" ON "Monster"("name");

-- CreateIndex
CREATE INDEX "Battle_player1Id_idx" ON "Battle"("player1Id");

-- CreateIndex
CREATE INDEX "Battle_player2Id_idx" ON "Battle"("player2Id");

-- CreateIndex
CREATE INDEX "Battle_winnerId_idx" ON "Battle"("winnerId");

-- AddForeignKey
ALTER TABLE "PlayerMonster" ADD CONSTRAINT "PlayerMonster_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMonster" ADD CONSTRAINT "PlayerMonster_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
