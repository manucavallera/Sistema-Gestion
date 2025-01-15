/*
  Warnings:

  - You are about to alter the column `razonSocial` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `direccion` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `cuit` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.
  - You are about to alter the column `zona` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `email` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `telefono` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `razonSocial` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `direccion` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `cuit` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.
  - You are about to alter the column `zona` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `telefono` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `email` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Changed the type of `tipoPago` on the `Pago` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "razonSocial" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "cuit" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "zona" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "deletedAt" TIMESTAMP(3),
DROP COLUMN "tipoPago",
ADD COLUMN     "tipoPago" "TipoPago" NOT NULL;

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "razonSocial" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "cuit" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "zona" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Recibo" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Remito" ADD COLUMN     "deletedAt" TIMESTAMP(3);
