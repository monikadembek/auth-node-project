/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `RefreshTokenStorage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokenStorage_token_key" ON "RefreshTokenStorage"("token");
