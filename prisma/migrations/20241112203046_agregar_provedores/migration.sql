/*
  Warnings:

  - You are about to drop the column `referencia` on the `MovimientoCuenta` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `formaDePagoId` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `metodo` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `movimientoId` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `tipoPago` on the `Pago` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Recibo` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the column `ventaId` on the `Remito` table. All the data in the column will be lost.
  - You are about to drop the `FormaDePago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovimientoCuentaToRecibo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovimientoCuentaToRemito` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "MetodoPago" ADD VALUE 'CHEQUE';

-- AlterEnum
ALTER TYPE "TipoPago" ADD VALUE 'CHEQUE';

-- DropForeignKey
ALTER TABLE "Pago" DROP CONSTRAINT "Pago_formaDePagoId_fkey";

-- DropForeignKey
ALTER TABLE "Pago" DROP CONSTRAINT "Pago_movimientoId_fkey";

-- DropForeignKey
ALTER TABLE "Remito" DROP CONSTRAINT "Remito_ventaId_fkey";

-- DropForeignKey
ALTER TABLE "_MovimientoCuentaToRecibo" DROP CONSTRAINT "_MovimientoCuentaToRecibo_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovimientoCuentaToRecibo" DROP CONSTRAINT "_MovimientoCuentaToRecibo_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovimientoCuentaToRemito" DROP CONSTRAINT "_MovimientoCuentaToRemito_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovimientoCuentaToRemito" DROP CONSTRAINT "_MovimientoCuentaToRemito_B_fkey";

-- AlterTable
ALTER TABLE "MovimientoCuenta" DROP COLUMN "referencia";

-- AlterTable
ALTER TABLE "Pago" DROP COLUMN "estado",
DROP COLUMN "formaDePagoId",
DROP COLUMN "metodo",
DROP COLUMN "movimientoId",
DROP COLUMN "tipoPago";

-- AlterTable
ALTER TABLE "Recibo" DROP COLUMN "total",
ADD COLUMN     "monto" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Remito" DROP COLUMN "cantidad",
DROP COLUMN "ventaId";

-- DropTable
DROP TABLE "FormaDePago";

-- DropTable
DROP TABLE "_MovimientoCuentaToRecibo";

-- DropTable
DROP TABLE "_MovimientoCuentaToRemito";

-- CreateTable
CREATE TABLE "Cheque" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "clienteId" INTEGER,
    "proveedorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Cheque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VentaRemitos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VentaRemitos_AB_unique" ON "_VentaRemitos"("A", "B");

-- CreateIndex
CREATE INDEX "_VentaRemitos_B_index" ON "_VentaRemitos"("B");

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cheque" ADD CONSTRAINT "Cheque_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VentaRemitos" ADD CONSTRAINT "_VentaRemitos_A_fkey" FOREIGN KEY ("A") REFERENCES "Remito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VentaRemitos" ADD CONSTRAINT "_VentaRemitos_B_fkey" FOREIGN KEY ("B") REFERENCES "Venta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
