import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Función para archivar compras y ventas más antiguas
export const archiveOldData = async () => {
  const currentDate = new Date();
  const oneMonthAgo = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );

  // Archivar compras más antiguas
  const oldCompras = await prisma.compra.findMany({
    where: {
      fecha: {
        lt: oneMonthAgo,
      },
    },
  });

  if (oldCompras.length > 0) {
    await prisma.compraArchivada.createMany({
      data: oldCompras.map((compra) => ({
        total: compra.total,
        fecha: compra.fecha,
      })),
    });

    await prisma.compra.deleteMany({
      where: {
        fecha: {
          lt: oneMonthAgo,
        },
      },
    });
  }

  // Archivar ventas más antiguas
  const oldVentas = await prisma.venta.findMany({
    where: {
      fecha: {
        lt: oneMonthAgo,
      },
    },
  });

  if (oldVentas.length > 0) {
    await prisma.ventaArchivada.createMany({
      data: oldVentas.map((venta) => ({
        total: venta.total,
        fecha: venta.fecha,
      })),
    });

    await prisma.venta.deleteMany({
      where: {
        fecha: {
          lt: oneMonthAgo,
        },
      },
    });
  }
};

// Función para obtener todas las compras archivadas
export const getArchivedCompras = async () => {
  return await prisma.compraArchivada.findMany();
};

// Función para obtener todas las ventas archivadas
export const getArchivedVentas = async () => {
  return await prisma.ventaArchivada.findMany();
};
