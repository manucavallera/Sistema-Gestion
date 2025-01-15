/*
  Warnings:

  - Added the required column `estado` to the `Pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidad` to the `Remito` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "email" TEXT,
ADD COLUMN     "telefono" TEXT;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "estado" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Remito" ADD COLUMN     "cantidad" INTEGER NOT NULL;
