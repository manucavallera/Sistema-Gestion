/*
  Warnings:

  - You are about to alter the column `monto` on the `Cheque` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `Compra` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `monto` on the `MovimientoCuenta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `saldo` on the `MovimientoCuenta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `monto` on the `Pago` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `monto` on the `Recibo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `Remito` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `total` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Cheque" ALTER COLUMN "monto" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Compra" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "MovimientoCuenta" ALTER COLUMN "monto" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "saldo" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Pago" ALTER COLUMN "monto" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Recibo" ALTER COLUMN "monto" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Remito" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Venta" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);
