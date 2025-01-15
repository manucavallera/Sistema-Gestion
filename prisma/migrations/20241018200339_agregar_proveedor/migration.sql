-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "zona" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "zona" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cuit_key" ON "Cliente"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_cuit_key" ON "Proveedor"("cuit");
