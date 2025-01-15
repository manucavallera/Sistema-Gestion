-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;
