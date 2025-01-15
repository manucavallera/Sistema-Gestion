/*
  Warnings:

  - The values [CREDITO,DEBITO] on the enum `TipoMovimiento` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deletedAt` on the `Pago` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoMovimiento_new" AS ENUM ('INGRESO', 'EGRESO');
ALTER TABLE "MovimientoCuenta" ALTER COLUMN "tipo" TYPE "TipoMovimiento_new" USING ("tipo"::text::"TipoMovimiento_new");
ALTER TYPE "TipoMovimiento" RENAME TO "TipoMovimiento_old";
ALTER TYPE "TipoMovimiento_new" RENAME TO "TipoMovimiento";
DROP TYPE "TipoMovimiento_old";
COMMIT;

-- AlterTable
ALTER TABLE "Pago" DROP COLUMN "deletedAt";
