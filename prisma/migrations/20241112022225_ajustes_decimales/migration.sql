/*
  Warnings:

  - You are about to alter the column `saldo` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `total` on the `Compra` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `monto` on the `MovimientoCuenta` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `saldo` on the `MovimientoCuenta` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `monto` on the `Pago` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - The `estado` column on the `Pago` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `saldo` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `total` on the `Recibo` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `total` on the `Remito` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `total` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Changed the type of `tipo` on the `MovimientoCuenta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `metodo` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('CREDITO', 'DEBITO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "saldo" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "FormaDePago" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MovimientoCuenta" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoMovimiento" NOT NULL,
ALTER COLUMN "monto" SET DEFAULT 0,
ALTER COLUMN "monto" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "saldo" SET DEFAULT 0,
ALTER COLUMN "saldo" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "formaDePagoId" INTEGER,
ADD COLUMN     "metodo" "MetodoPago" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "monto" SET DEFAULT 0,
ALTER COLUMN "monto" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "saldo" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "compraId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "ventaId" INTEGER,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Remito" ADD COLUMN     "compraId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "ventaId" INTEGER,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_formaDePagoId_fkey" FOREIGN KEY ("formaDePagoId") REFERENCES "FormaDePago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
