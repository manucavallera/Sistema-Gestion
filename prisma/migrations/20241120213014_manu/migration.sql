/*
  Warnings:

  - You are about to alter the column `saldo` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `saldo` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "apellido" VARCHAR(100),
ADD COLUMN     "debe" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "haber" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "nombre" VARCHAR(100),
ALTER COLUMN "razonSocial" DROP NOT NULL,
ALTER COLUMN "saldo" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "apellido" VARCHAR(100),
ADD COLUMN     "debe" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "haber" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "nombre" VARCHAR(100),
ALTER COLUMN "razonSocial" DROP NOT NULL,
ALTER COLUMN "saldo" SET DATA TYPE DECIMAL(10,2);
