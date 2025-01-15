/*
  Warnings:

  - You are about to drop the column `fecha` on the `Cheque` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cheque" DROP COLUMN "fecha",
ADD COLUMN     "banco" VARCHAR(255) NOT NULL DEFAULT 'Sin banco',
ADD COLUMN     "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaVencimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "numero" VARCHAR(50) NOT NULL DEFAULT 'Sin número',
ADD COLUMN     "sucursal" VARCHAR(255) NOT NULL DEFAULT 'Sin sucursal';
