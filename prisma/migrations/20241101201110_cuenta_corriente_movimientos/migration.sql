-- CreateTable
CREATE TABLE "MovimientoCuenta" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "clienteId" INTEGER,
    "proveedorId" INTEGER,
    "referencia" TEXT,

    CONSTRAINT "MovimientoCuenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipoPago" TEXT NOT NULL,
    "clienteId" INTEGER,
    "proveedorId" INTEGER,
    "movimientoId" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovimientoCuenta" ADD CONSTRAINT "MovimientoCuenta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoCuenta" ADD CONSTRAINT "MovimientoCuenta_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_movimientoId_fkey" FOREIGN KEY ("movimientoId") REFERENCES "MovimientoCuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
