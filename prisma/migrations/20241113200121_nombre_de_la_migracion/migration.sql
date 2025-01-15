/*
  Warnings:

  - You are about to drop the column `compraId` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the column `proveedorId` on the `Remito` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_compraId_fkey";

-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_proveedorId_fkey";

-- AlterTable
ALTER TABLE "Remito" DROP COLUMN "compraId",
DROP COLUMN "proveedorId";
