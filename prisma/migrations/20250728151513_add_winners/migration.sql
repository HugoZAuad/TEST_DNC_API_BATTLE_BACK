/*
  Warnings:

  - You are about to drop the column `wins` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "wins",
ADD COLUMN     "winners" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");
