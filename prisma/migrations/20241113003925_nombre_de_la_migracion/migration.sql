/*
  Warnings:

  - Added the required column `tipoPago` to the `MovimientoCuenta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovimientoCuenta" ADD COLUMN     "tipoPago" "TipoPago" NOT NULL;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE';
