/*
  Warnings:

  - A unique constraint covering the columns `[playerId]` on the table `Monster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playerId` to the `Monster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Monster" ADD COLUMN     "playerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Monster_playerId_key" ON "Monster"("playerId");

-- CreateIndex
CREATE INDEX "Monster_playerId_idx" ON "Monster"("playerId");
