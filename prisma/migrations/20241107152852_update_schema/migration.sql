-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FormaDePago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "FormaDePago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormaDePago_nombre_key" ON "FormaDePago"("nombre");
