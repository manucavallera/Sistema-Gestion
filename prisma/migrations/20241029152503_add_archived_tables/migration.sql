-- CreateTable
CREATE TABLE "CompraArchivada" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompraArchivada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaArchivada" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VentaArchivada_pkey" PRIMARY KEY ("id")
);
