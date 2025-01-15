/*
  Warnings:

  - Added the required column `metodoPago` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "metodoPago" "MetodoPago" NOT NULL DEFAULT 'EFECTIVO';

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "metodoPago" "MetodoPago" NOT NULL;
