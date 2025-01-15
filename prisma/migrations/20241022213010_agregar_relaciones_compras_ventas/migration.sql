/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCompra` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Venta` table. All the data in the column will be lost.
  - You are about to drop the column `fechaVenta` on the `Venta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "descripcion",
DROP COLUMN "fechaCompra",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Venta" DROP COLUMN "descripcion",
DROP COLUMN "fechaVenta",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
