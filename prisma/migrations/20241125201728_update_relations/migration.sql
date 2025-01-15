/*
  Warnings:

  - Added the required column `movimientoId` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "movimientoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "MovimientoCuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
