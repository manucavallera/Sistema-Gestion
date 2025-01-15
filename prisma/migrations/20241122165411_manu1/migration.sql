/*
  Warnings:

  - The values [INGRESO,EGRESO] on the enum `TipoMovimiento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoMovimiento_new" AS ENUM ('COMPRA', 'VENTA');
ALTER TABLE "MovimientoCuenta" ALTER COLUMN "tipo" TYPE "TipoMovimiento_new" USING ("tipo"::text::"TipoMovimiento_new");
ALTER TYPE "TipoMovimiento" RENAME TO "TipoMovimiento_old";
ALTER TYPE "TipoMovimiento_new" RENAME TO "TipoMovimiento";
DROP TYPE "TipoMovimiento_old";
COMMIT;

-- AlterTable
ALTER TABLE "MovimientoCuenta" ADD COLUMN     "razonSocial" VARCHAR(255);
