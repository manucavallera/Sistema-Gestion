-- CreateTable
CREATE TABLE "Recibo" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "clienteId" INTEGER,
    "proveedorId" INTEGER,

    CONSTRAINT "Recibo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Remito" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,
    "clienteId" INTEGER,
    "proveedorId" INTEGER,

    CONSTRAINT "Remito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovimientoCuentaToRecibo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovimientoCuentaToRemito" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MovimientoCuentaToRecibo_AB_unique" ON "_MovimientoCuentaToRecibo"("A", "B");

-- CreateIndex
CREATE INDEX "_MovimientoCuentaToRecibo_B_index" ON "_MovimientoCuentaToRecibo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovimientoCuentaToRemito_AB_unique" ON "_MovimientoCuentaToRemito"("A", "B");

-- CreateIndex
CREATE INDEX "_MovimientoCuentaToRemito_B_index" ON "_MovimientoCuentaToRemito"("B");

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recibo" ADD CONSTRAINT "Recibo_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remito" ADD CONSTRAINT "Remito_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovimientoCuentaToRecibo" ADD CONSTRAINT "_MovimientoCuentaToRecibo_A_fkey" FOREIGN KEY ("A") REFERENCES "MovimientoCuenta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovimientoCuentaToRecibo" ADD CONSTRAINT "_MovimientoCuentaToRecibo_B_fkey" FOREIGN KEY ("B") REFERENCES "Recibo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovimientoCuentaToRemito" ADD CONSTRAINT "_MovimientoCuentaToRemito_A_fkey" FOREIGN KEY ("A") REFERENCES "MovimientoCuenta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovimientoCuentaToRemito" ADD CONSTRAINT "_MovimientoCuentaToRemito_B_fkey" FOREIGN KEY ("B") REFERENCES "Remito"("id") ON DELETE CASCADE ON UPDATE CASCADE;
